import { IRequestOptions } from 'lib/interfaces';
import * as https from 'https';
import * as fastXml from 'fast-xml-parser';
import axios from 'axios';

export class SoapAid {
  parser: (
    xmlData: string,
    options?: Partial<fastXml.X2jOptions>,
    validationOptions?: boolean | Partial<fastXml.validationOptions>,
  ) => any;
  cbMsg: (code: string, username: string, message: string) => string;
  cbXml: (msg: any) => string;
  requestOptions: IRequestOptions;
  msg: string;
  xml: string;

  constructor(
    parser: (
      xmlData: string,
      options?: Partial<fastXml.X2jOptions>,
      validationOptions?: boolean | Partial<fastXml.validationOptions>,
    ) => any,
    cbMsg: (code: string, username: string, message: string) => string,
    cbXml: (msg: any) => string,
  ) {
    this.parser = parser;
    this.cbMsg = cbMsg;
    this.cbXml = cbXml;
  }

  createPackage(code: string, username: string, message: string): { msg: string; xml: string } {
    this.msg = this.cbMsg(code, username, message);
    console.log('createPackage:msg ===> ', JSON.stringify(this.msg));
    this.xml = this.cbXml(this.msg);
    console.log('createPackage:xml ===> ', this.xml);
    return {
      msg: this.msg,
      xml: this.xml,
    };
  }

  createRequestOptions(httpsAgent: https.Agent, auth: string, data: string, SOAPAction: string): IRequestOptions {
    this.requestOptions = {
      url: 'https://cc2ws-live.sd.demo.truelink.com/wcf/CC2.svc',
      method: 'POST',
      data: data,
      httpsAgent,
      headers: {
        'Accept-Encoding': 'gzip,deflate',
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction: `https://consumerconnectws.tui.transunion.com/ICC2/${SOAPAction}`,
        Authorization: auth,
        'Content-Length': data.length,
        Host: 'cc2ws-live.sd.demo.truelink.com',
        Connection: 'Keep-Alive',
        'User-Agent': 'Apache-HttpClient/4.5.2 (Java/1.8.0_181)',
      },
    };
    return this.requestOptions;
  }

  /**
   * Generic method to process the axios request to send to TU
   * - uses the parser provided to process return message
   * @param options
   * @param parser
   * @param parserOptions
   * @returns parsed and stringified data
   */
  async processRequest(parserOptions: Partial<fastXml.X2jOptions>): Promise<any> {
    try {
      const res = await axios({ ...this.requestOptions });
      const results = this.parser(res.data, parserOptions);
      return results;
    } catch (err) {
      console.log('processRequest:err ===> ', err);
      return err;
    }
  }
}
