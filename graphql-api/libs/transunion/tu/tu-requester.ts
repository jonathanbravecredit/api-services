import { ACCOUNT_CODE, ACCOUNT_NAME } from 'libs/data/constants';
import { APIRequestKeys, APIRequestLibrary, APIRequestXMLLibrary } from 'libs/utils/requests/requests';
import { Nested as _nest } from 'libs/utils/helpers/Nested';
import { v4 } from 'uuid';
import * as _ from 'lodash';
import * as convert from 'xml-js';
import { XMLUtil } from 'libs/utils/xml/XMLUtil';

export class TURequester<T> {
  public accountCode: string = ACCOUNT_CODE;
  public accountName: string = ACCOUNT_NAME;
  public clientKey: string;

  public requestObject: any = {};
  public requestXMLObject: any = {};
  public requestMap: { [key: string]: any };
  public requestXMLMap: { [key: string]: any };

  public xml: string = '';

  constructor(public requestKey: APIRequestKeys, public payload: T) {
    this.requestMap = APIRequestLibrary[this.requestKey];
    this.requestXMLMap = APIRequestXMLLibrary[this.requestKey];
  }

  createRequest(): string {
    if (!this.requestMap || !this.requestXMLMap)
      throw new Error(`map: ${this.requestMap} or xml map: ${this.requestXMLMap} request is not set`);
    this.generateRequestObject();
    this.generateXMLObject();
    this.convertXML();
    return this.xml;
  }

  generateRequestObject(): void {
    this.requestObject = this.getReqWrapper(_nest.unflatten(this.parseRequest({ ...this.requestMap })));
  }

  generateXMLObject(): void {
    this.requestXMLObject = this.getXMLWrapper(_nest.unflatten(this.parseXML({ ...this.requestXMLMap })));
  }

  getReqWrapper(body: any): any {
    return {
      AccountCode: ACCOUNT_CODE,
      AccountName: ACCOUNT_NAME,
      AdditionalInputs: {
        Data: {
          Name: 'CreditReportVersion',
          Value: '7.1',
        },
      },
      RequestKey: `BC-${v4()}`,
      ...body,
    };
  }

  getXMLWrapper(body: any): any {
    return {
      'soapenv:Envelope': {
        _attributes: {
          'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
          'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
          'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
        },
        'soapenv:Header': {},
        ...body,
      },
    };
  }

  parseRequest(obj: any): any {
    if (!this.payload || !Object.keys(this.payload).length) return {};
    _.entries(this.requestMap).forEach(([key, value]) => {
      const path = String(value).split('.');
      const val = _.get({ root: this.payload }, path);
      obj[key] = val;
    });
    return obj;
  }

  parseXML(obj: any): any {
    if (!this.requestObject || !Object.keys(this.requestObject).length) return {};
    _.entries(this.requestXMLMap).forEach(([key, value]) => {
      const path = String(value).split('.');
      const val = _.get({ root: this.requestObject }, path);
      obj[key] = XMLUtil.textConstructor(val, true);
    });
    return obj;
  }

  convertXML(): void {
    if (!this.requestXMLObject || !Object.keys(this.requestXMLObject)) return;
    const xml = convert.json2xml(JSON.stringify(this.requestXMLObject), { compact: true, spaces: 4 });
    this.xml = xml;
  }
}
