import { IRequestOptions } from 'libs/interfaces';
import * as https from 'https';
import * as fastXml from 'fast-xml-parser';
import axios from 'axios';
import TransactionLogger from 'libs/utils/db/logger/logger-transactions';

const transactionLogger = new TransactionLogger();
const tuEnv = process.env.TU_ENV;
const tuUrl =
  tuEnv === 'dev' || tuEnv === 'staging'
    ? 'https://cc2ws-live.sd.demo.truelink.com/wcf/CC2.svc'
    : 'https://consumerconnectws.tui.transunion.com/wcf/CC2.svc';
const tuHost = tuEnv === 'dev' ? 'cc2ws-live.sd.demo.truelink.com' : 'consumerconnectws.tui.transunion.com';
/**
 * Class to help create and parse payloads for requests to Transunion SOAP service
 * 1. Takes in unique parsers, formatters(messages, and xml), and payload generators (optional)
 * 2. Each method provided is unique to the transunion service called but this class
 *    standards the invocations needed to successfully send the request
 *   - Payload Generator (cbPayload): Takes the GQL request and parses it to the proper schema.
 *        * if none specified, just passes the object through
 *   - Message Packager (cbMsg): Wraps the payload in the appropriate account code, name values
 *   - Xml Generator (cbXml): Converts the JSON object message to an XML string
 *   - Parser (parser): Takes the designated parser library with options to parse the xml string response
 */
export class SoapAid {
  parser: (
    xmlData: string,
    options?: Partial<fastXml.X2jOptions>,
    validationOptions?: boolean | Partial<fastXml.validationOptions>,
  ) => any;
  cbMsg: (code: string, username: string, message: string) => string;
  cbXml: (msg: any) => string;
  cbPayload: (data: any, params: any) => any | undefined;
  requestPayload: IRequestOptions;
  msg: string;
  xml: string;
  envUrl: string;
  host: string;
  constructor(
    parser: (
      xmlData: string,
      options?: Partial<fastXml.X2jOptions>,
      validationOptions?: boolean | Partial<fastXml.validationOptions>,
    ) => any = fastXml.parse,
    cbMsg: (code: string, username: string, message: any) => any,
    cbXml: (msg: any) => string,
    cbPayload: (data: any, params?: any) => any = (a): any => {
      return a;
    },
    envUrl: string = tuUrl,
    host: string = tuHost,
  ) {
    this.parser = parser;
    this.cbMsg = cbMsg;
    this.cbXml = cbXml;
    this.cbPayload = cbPayload; // can send preformed payload
    this.envUrl = envUrl;
    this.host = host;
  }

  /**
   * Generic method to create payloads by type
   * @param cbPayload
   * @param data
   * @param params
   * @returns
   */
  createPayload<T>(data: any, params?: any): T {
    return this.cbPayload(data, params);
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
      url: this.envUrl,
      method: 'POST',
      data: data,
      httpsAgent,
      headers: {
        'Accept-Encoding': 'gzip,deflate',
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction: `https://consumerconnectws.tui.transunion.com/ICC2/${SOAPAction}`,
        Authorization: auth,
        'Content-Length': data.length,
        Host: this.host,
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
      const l1 = transactionLogger.createTransaction('soap_aid', 'parser_results', JSON.stringify(results));
      await transactionLogger.logger.create(l1);
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
      console.log('MOCK parsed response ==> ', JSON.stringify(results));
      return results;
    } catch (err) {
      console.log('processRequest:err ===> ', err);
      return err;
    }
  }

  /**
   * The catch all method helps simply the TU service request and send back the response
   * @param accountCode
   * @param username
   * @param agent
   * @param auth
   * @param prepayload
   * @param action
   * @param parserOptions
   * @returns
   */
  async parseAndSendPayload<T>(
    accountCode: string,
    username: string,
    agent: https.Agent,
    auth: string,
    prepayload: any,
    action: string,
    parserOptions: Partial<fastXml.X2jOptions>,
  ): Promise<T> {
    const payload = this.createPayload(prepayload);
    const { msg, xml } = this.createPackage(accountCode, username, JSON.stringify(payload));
    const request = this.createRequestPayload(agent, auth, xml, action);
    if (!msg || !xml || !request || !payload) throw new Error(`Missing msg:${msg}, xml:${xml}, or request:${request}`);
    try {
      return await this.processRequest<T>(request, parserOptions);
    } catch (err) {
      console.log(`parseAndSendPayload error=${err}`);
      throw `Uncaught error in parse and send`;
    }
  }

  /**
   * !!!!IMPORTANT!!! For mocking only.
   * @param accountCode
   * @param username
   * @param agent
   * @param auth
   * @param prepayload
   * @param action
   * @param parserOptions
   * @returns
   */
  async parseAndDontSendPayload<T>(
    accountCode: string,
    username: string,
    agent: https.Agent,
    auth: string,
    prepayload: any,
    action: string,
    parserOptions: Partial<fastXml.X2jOptions>,
  ): Promise<any> {
    const payload = this.createPayload(prepayload);
    const { msg, xml } = this.createPackage(accountCode, username, JSON.stringify(payload));
    const request = this.createRequestPayload(agent, auth, xml, action);
    if (!msg || !xml || !request || !payload) throw new Error(`Missing msg:${msg}, xml:${xml}, or request:${request}`);
    console.log('your MOCK payload is ===> ', payload);
    console.log('your MOCK message is ===> ', msg);
    console.log('your MOCK xml is ===> ', xml);
    console.log('your MOCK request is ===> ', request);
    try {
      return;
    } catch (err) {
      console.log(`parseAndSendPayload error=${err}`);
      throw `Uncaught error in parse and send`;
    }
  }
}
