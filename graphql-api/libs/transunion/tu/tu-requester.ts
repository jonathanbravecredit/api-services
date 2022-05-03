import { ACCOUNT_CODE, ACCOUNT_NAME } from 'libs/data/constants';
import { APIRequestKeys, APIRequestLibrary, APIRequestXMLLibrary } from 'libs/utils/requests/requests';
import { Nested as _nest } from 'libs/utils/helpers/Nested';

import * as _ from 'lodash';
import * as convert from 'xml-js';
import { XMLUtil } from 'libs/utils/xml/XMLUtil';

export class TURequester<T> {
  public accountCode: string = ACCOUNT_CODE;
  public accountName: string = ACCOUNT_NAME;
  public clientKey: string;

  public request: any = null;
  public requestMap: { [key: string]: any };
  public requestXML: { [key: string]: any };

  public xml: string = '';
  public xmlObject: any = null;

  constructor(public requestKey: APIRequestKeys, public payload: T, public serviceBundleCode = '') {
    this.requestMap = APIRequestLibrary[this.requestKey];
    this.requestXML = APIRequestXMLLibrary[this.requestKey];
  }

  run(): void {
    if (!this.requestMap || !this.requestXML)
      throw new Error(`map: ${this.requestMap} or xml: ${this.requestXML} request is not set`);
    this.generateRequest();
    this.addRequestDefaults();
    this.generateXMLObject();
    this.addXMLDefaults();
    this.convertXML();
  }

  generateRequest(): void {
    this.request = _nest.unflatten(this.parseRequest({ ...this.requestMap }));
  }

  generateXMLObject(): void {
    this.xmlObject = _nest.unflatten(this.parseXML({ ...this.requestXML }));
  }

  addRequestDefaults(): void {
    this.request = _.merge(this.request, APIRequestLibrary[APIRequestKeys.DEFAULTS], {
      ServiceBundleCode: this.serviceBundleCode,
    });
  }

  addXMLDefaults(): void {
    this.xmlObject = _.merge(this.xmlObject, APIRequestXMLLibrary[APIRequestKeys.DEFAULTS]);
  }

  parseRequest(obj: any): any {
    _.entries(this.requestMap).forEach(([key, value]) => {
      const path = String(value).split('.');
      const val = _.get({ root: this.payload }, path);
      obj[key] = val;
    });
    return obj;
  }

  parseXML(obj: any): any {
    _.entries(this.requestXML).forEach(([key, value]) => {
      const path = String(value).split('.');
      const val = _.get({ root: this.request }, path);
      obj[key] = XMLUtil.textConstructor(val, true);
    });
    return obj;
  }

  convertXML(): void {
    const xml = convert.json2xml(JSON.stringify(this.xmlObject), { compact: true, spaces: 4 });
    this.xml = xml;
  }
}
