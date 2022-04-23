import { IRequestOptions } from 'lib/interfaces';
import * as https from 'https';
import * as fastXml from 'fast-xml-parser';
import axios from 'axios';

const tuEnv = process.env.TU_ENV;
const tuUrl =
  tuEnv === 'dev'
    ? 'https://cc2ws-test.sd.demo.truelink.com/wcf/CC2.svc' //'https://cc2ws-live.sd.demo.truelink.com/wcf/CC2.svc'
    : 'https://consumerconnectws.tui.transunion.com/wcf/CC2.svc';
const tuHost =
  tuEnv === 'dev'
    ? 'cc2ws-test.sd.demo.truelink.com' //'cc2ws-live.sd.demo.truelink.com'
    : 'consumerconnectws.tui.transunion.com';
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
export class SoapV2 {
  protected url: string = tuUrl;
  protected host: string = tuHost;

  requestPayload: IRequestOptions;
  response: string;
  constructor() {}

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
      url: this.url,
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
   * @param parserOptions
   * @returns parsed and stringified data
   */
  async processRequest(request: IRequestOptions): Promise<string> {
    try {
      this.response = (await axios({ ...request })).data;
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
  async sendRequest(
    agent: https.Agent,
    auth: string,
    action: string,
    parserOptions: Partial<fastXml.X2jOptions>,
    xml: string,
  ): Promise<void> {
    const request = this.createRequestPayload(agent, auth, xml, action);
    if (!xml || !request) throw new Error(`Missing xml:${xml}, or request:${request}`);
    try {
      await this.processRequest(request);
    } catch (err) {
      console.log(`parseAndSendPayload error=${err}`);
      throw `Uncaught error in parse and send`;
    }
  }
}
