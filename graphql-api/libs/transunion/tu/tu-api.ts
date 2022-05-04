import * as https from 'https';
import { Nested as _nest } from 'libs/utils/helpers/Nested';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { IProxyRequest } from 'libs/interfaces';
import { IProxyHandlerResponse } from 'libs/interfaces/api/proxy-handler.interfaces';
import { APIRequest } from 'libs/models/api-request.model';
import { LoggerTransactionals } from 'libs/utils/logger/LoggerTransactionals';
import { DEFAULT_PARSER_OPTIONS } from 'libs/utils/parser/options';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { TUResponder } from 'libs/transunion/tu/tu-responder';

export class TUAPIProcessor<P, RESP, RESU> extends LoggerTransactionals implements APIRequest {
  public reqXML: string;
  public resXML: string;
  public gqldata: any;
  public prepped: P;
  public response: RESP;
  public responseType: string;
  public responseError: any;
  public responseResult: RESU;
  public results: IProxyHandlerResponse<any>;
  public parserOptions = DEFAULT_PARSER_OPTIONS;

  public schema: string = '';
  public resultKey: string = '';
  public serviceBundleCode: string = '';

  constructor(
    public action: string,
    protected payload: IProxyRequest,
    protected responder: TUResponder<RESP, any>,
    public payloader: Payloader<P>,
    public soap: SoapV2,
  ) {
    super(action);
  }

  /**
   * API runner to:
   *  - prep the payload (via the Payloader)
   *  - map to the request data structure and generate the request XML (with the Requester)
   *  - send request, parse response, and sync response to database (with the Responder)
   *  - log the results and send back results to API
   * @returns
   */
  async run(): Promise<IProxyHandlerResponse<RESU>> {
    const { agent, auth, identityId } = this.payload;
    try {
      await this.runPayloader();
      this.runRequester();
      await this.runSendAndSync(agent, auth);
      await this.logResults();
      return this.results;
    } catch (err) {
      console.log('error called', err);
      this.logGenericError(identityId, err);
      return { success: false, data: null, error: err };
    }
  }

  /**
   * Payloader runner to:
   *  - validate the payload
   *  - prep the payload (can be async if need to get DB data)
   * @returns
   */
  runPayloader(): void {
    const payload = this.prepPayload();
    this.payloader.validate<P>(payload, this.schema);
    this.gqldata = this.payloader.data;
    this.prepped = payload;
    console.log('prepped: ', this.prepped);
  }

  /**
   * Layer in the:
   *  - identity ID
   *  - parsed message
   *  - service bundle code
   * These are the most common payload values
   * @returns
   */
  prepPayload(): P {
    const msg = this.payload.message || '{}';
    return {
      id: this.payload.identityId,
      ...JSON.parse(msg),
      serviceBundleCode: this.serviceBundleCode,
    };
  }

  /**
   * Requester runner to:
   * run the indicative enrichment request which:
   *    - accepts the payload
   *    - generates the request object
   *    - generates the request xml
   */
  runRequester(): void {
    throw new Error('runRequester must be individually implemented');
  }

  /**
   * Send and Sync runner to:
   *  - use the soap client to send the request
   *  - use the sync client to get a copy of the current state (optional)
   *  - use the responder to parse the response
   *  - use the responder to enrich the current state with new data
   *  - set the response properties and create results
   * @param agent
   * @param auth
   */
  async runSendAndSync(agent: https.Agent, auth: string): Promise<void> {
    await this.soap.sendRequest(agent, auth, this.action, this.parserOptions, this.reqXML);
    this.responder.xml = this.soap.response;
    this.responder.parseResponse(this.parserOptions);
    this.setResponses(this.responder.response);
    this.responseType.toLowerCase() === 'success' ? this.setSuccessResults() : this.setFailedResults();
  }

  /**
   * Teakes the response back from the soap client and sets the:
   * - response
   * - responseType
   * - responseError
   * - responseResult
   * @param response
   */
  setResponses(response: RESP): void {
    this.response = response;
    this.responseType = _nest.find(this.response, 'ResponseType');
    this.responseError = _nest.find(this.response, 'ErrorResponse');
    this.responseResult = _nest.find(this.response, this.resultKey);
  }

  /**
   * Creates the results object for a successful call
   */
  setSuccessResults(): void {
    this.results = { success: true, error: this.responseError, data: this.responseResult };
  }

  /**
   * Creates the results object for a failed call
   */
  setFailedResults(): void {
    this.results = { success: false, error: this.responseError };
  }

  /**
   * logs the results of the API call
   */
  async logResults(): Promise<void> {
    const id = this.payload.identityId;
    await this.log(id, { ...this }, 'TRANSUNION');
    await this.log(id, this.results, 'GENERIC');
  }
}
