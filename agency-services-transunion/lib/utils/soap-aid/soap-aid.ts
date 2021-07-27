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
  cbPayload: (data: any, disputeId: string) => any | undefined;
  requestPayload: IRequestOptions;
  msg: string;
  xml: string;

  constructor(
    parser: (
      xmlData: string,
      options?: Partial<fastXml.X2jOptions>,
      validationOptions?: boolean | Partial<fastXml.validationOptions>,
    ) => any = fastXml.parse,
    cbMsg: (code: string, username: string, message: string) => any,
    cbXml: (msg: any) => string,
    cbPayload: (data: any, disputeId?: string) => any = (a, b): void => {},
  ) {
    this.parser = parser;
    this.cbMsg = cbMsg;
    this.cbXml = cbXml;
    this.cbPayload = cbPayload; // can send preformed payload
  }

  /**
   * Generic method to create payloads by type
   * @param cbPayload
   * @param data
   * @param disputeId
   * @returns
   */
  createPayload<T>(data: any, disputeId?: string): T {
    return this.cbPayload(data, disputeId);
  }

  /**
   * Generic method to generate the xml and msg object for sending to TU
   * @param code
   * @param username
   * @param message
   * @returns
   */
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

  /**
   * Creates the request options to send to soap service as part of axios request
   * @param httpsAgent
   * @param auth
   * @param data
   * @param SOAPAction
   * @returns
   */
  createRequestPayload(httpsAgent: https.Agent, auth: string, data: string, SOAPAction: string): IRequestOptions {
    this.requestPayload = {
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
    return this.requestPayload;
  }

  /**
   * Generic method to process the axios request to send to TU
   * - uses the parser provided to process return message
   * @param options
   * @param parser
   * @param parserOptions
   * @returns parsed and stringified data
   */
  async processRequest<T>(request: IRequestOptions, parserOptions: Partial<fastXml.X2jOptions>): Promise<T> {
    try {
      const res = await axios({ ...request });
      const results = this.parser(res.data, parserOptions);
      console.log('soap-aid:parser results ===> ', results);
      return results;
    } catch (err) {
      console.log('processRequest:err ===> ', err);
      return err;
    }
  }

  /**
   * Generic method to process the axios request to send to TU
   * - uses the parser provided to process return message
   * @param options
   * @param parser
   * @param parserOptions
   * @returns parsed and stringified data
   */
  async processMockRequest<T>(mock: string, parserOptions: Partial<fastXml.X2jOptions>): Promise<T> {
    try {
      const results = this.parser(mock, parserOptions);
      return results;
    } catch (err) {
      console.log('processRequest:err ===> ', err);
      return err;
    }
  }

  async parseAndSendPayload<T>(
    accountCode: string,
    username: string,
    agent: https.Agent,
    auth: string,
    prepayload: any,
    action: string,
    parserOptions: Partial<fastXml.X2jOptions>,
    message?: any,
  ): Promise<T> {
    const payload = message ? message : this.createPayload(prepayload);
    const { msg, xml } = this.createPackage(accountCode, username, JSON.stringify(payload));
    const request = this.createRequestPayload(agent, auth, xml, action);
    if (!msg || !xml || !request) throw new Error(`Missing msg:${msg}, xml:${xml}, or request:${request}`);
    return await this.processRequest<T>(request, parserOptions);
  }
}
