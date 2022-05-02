import { ACCOUNT_CODE, ACCOUNT_NAME } from 'lib/data/constants';
import { APIRequestKeys, APIRequestLibrary, APIRequestXMLLibrary } from 'lib/utils/requests/requests';
import { Nested as _nest } from 'lib/utils/helpers/Nested';

import * as _ from 'lodash';
import * as convert from 'xml-js';
import { XMLUtil } from 'lib/utils/xml/XMLUtil';

export class TURequester<T> {
  protected accountCode: string = ACCOUNT_CODE;
  protected accountName: string = ACCOUNT_NAME;
  protected clientKey: string;

  protected request: any = null;
  protected requestMap: { [key: string]: any };
  protected requestXML: { [key: string]: any };

  public xml: string = '';
  public xmlObject: any = null;

  constructor(private requestKey: APIRequestKeys, private payload: T, private serviceBundleCode = '') {
    this.requestMap = APIRequestLibrary[this.requestKey];
    this.requestXML = APIRequestXMLLibrary[this.requestKey];
  }

  run(): void {
    this.generateRequest();
    this.addRequestDefaults();
    this.generateXMLObject();
    this.addXMLDefaults();
    this.convertXML();
  }

  generateRequest(): void {
    const result = Object.assign({}, this.requestMap);
    Object.entries(this.requestMap).forEach(([key, value]) => {
      const path = (value as string).split('.');
      const val = _.get({ root: this.payload }, path);
      result[key] = val;
    });
    const unflat = _nest.unflatten(result);
    this.request = unflat;
  }

  addRequestDefaults(): void {
    this.request = _.merge(this.request, APIRequestLibrary[APIRequestKeys.DEFAULTS], {
      serviceBundleCode: this.serviceBundleCode,
    });
  }

  generateXMLObject(): void {
    const result = Object.assign({}, this.requestXML);
    Object.entries(this.requestXML).forEach(([key, value]) => {
      const path = (value as string).split('.');
      const val = _.get({ root: this.request }, path);
      result[key] = XMLUtil.textConstructor(val, true);
    });
    const unflat = _nest.unflatten(result);
    this.xmlObject = unflat;
  }

  addXMLDefaults(): void {
    this.xmlObject = _.merge(this.xmlObject, APIRequestXMLLibrary[APIRequestKeys.DEFAULTS]);
  }

  convertXML(): void {
    const xml = convert.json2xml(JSON.stringify(this.xmlObject), { compact: true, spaces: 4 });
    this.xml = xml;
  }
}
