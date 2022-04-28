import { ACCOUNT_CODE, ACCOUNT_NAME } from 'lib/data/constants';
import { APIRequestKeys, APIRequestLibrary, APIRequestXMLLibrary } from 'lib/utils/requests/requests';
import { Nested as _nest } from 'lib/utils/helpers/Nested';
import { v4 } from 'uuid';
import * as _ from 'lodash';
import * as convert from 'xml-js';

export class TURequester<T> {
  protected accountCode: string = ACCOUNT_CODE;
  protected accountName: string = ACCOUNT_NAME;
  protected clientKey: string;

  private request: any = null;
  private requestMap: { [key: string]: string };
  private requestXML: { [key: string]: string };

  public xml: string = '';

  constructor(private requestKey: APIRequestKeys, private payload: T) {
    this.requestMap = APIRequestLibrary[this.requestKey];
    this.requestXML = APIRequestXMLLibrary[this.requestKey];
    this.generateRequest();
    this.addDefaults();
    this.generateXML();
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

  addDefaults(): void {
    this.request = {
      ...this.request,
      AccountCode: this.accountCode,
      AccountName: this.accountName,
      AdditionalInputs: {
        Data: {
          Name: 'CreditReportVersion',
          Value: '7.1',
        },
      },
      RequestKey: `BC-${v4()}`,
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
    };
  }

  generateXML(): void {
    const result = Object.assign({}, this.requestXML);
    Object.entries(this.requestXML).forEach(([key, value]) => {
      const path = (value as string).split('.');
      const val = _.get({ root: this.request }, path);
      result[key] = val;
    });
    const unflat = _nest.unflatten(result);
    const xml = convert.json2xml(JSON.stringify(unflat), { compact: true, spaces: 4 });
    this.xml = xml;
  }
}
