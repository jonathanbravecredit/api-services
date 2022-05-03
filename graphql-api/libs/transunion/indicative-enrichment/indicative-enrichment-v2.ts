import * as https from 'https';
import * as dayjs from 'dayjs';
import { Nested as _nest } from 'libs/utils/helpers/Nested';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { IProxyRequest } from 'libs/interfaces';
import { DEFAULT_PARSER_OPTIONS } from 'libs/utils/parser/options';
import { IProxyHandlerResponse } from 'libs/interfaces/api/proxy-handler.interfaces';
import { LoggerTransactionals } from 'libs/utils/logger/LoggerTransactionals';
import { APIRequest } from 'libs/models/api-request.model';
import {
  IIndicativeEnrichmentPayload,
  IIndicativeEnrichmentResponse,
  IIndicativeEnrichmentResult,
} from 'libs/transunion/indicative-enrichment/indicative-enrichment.interface';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { IndicativeEnrichmentRequester } from 'libs/transunion/indicative-enrichment/subclasses/indicative-enrichment.requester';
import { IndicativeEnrichmentResponder } from 'libs/transunion/indicative-enrichment/subclasses/indicative-enrichment.responder';

export class IndicativeEnrichmentV2 extends LoggerTransactionals implements APIRequest {
  public reqXML: string;
  public resXML: string;
  public gqldata: any;
  public prepped: IIndicativeEnrichmentPayload;
  public action = 'IndicativeEnrichment';
  public parserOptions = DEFAULT_PARSER_OPTIONS;
  public response: IIndicativeEnrichmentResponse; //IFulfillResponse;
  public responseType: string;
  public responseError: any;
  public responseResult: IIndicativeEnrichmentResult;
  public results: IProxyHandlerResponse<IIndicativeEnrichmentResult>;
  public serviceBundleCode = 'CC2BraveCreditIndicativeEnrichment';

  constructor(protected payload: IProxyRequest) {
    super('IndicativeEnrichment');
  }

  /**
   * API runner to:
   *  - prep the payload (via the Payloader)
   *  - map to the request data structure and generate the request XML (with the Requester)
   *  - send request, parse response, and sync response to database (with the Responder)
   *  - log the results and send back results to API
   * @returns
   */
  async run(): Promise<IProxyHandlerResponse<IIndicativeEnrichmentResult>> {
    const { agent, auth, identityId } = this.payload;
    try {
      await this.runPayloader();
      this.formatDob(); // added step
      this.runRequester();
      await this.runSendAndSync(agent, auth);
      await this.logResults();
      return this.results;
    } catch (err) {
      this.logGenericError(identityId, err);
      return { success: false, data: null, error: err };
    }
  }

  /**
   * Payloader runner to:
   *  - validate the payload
   *  - prep the payload
   * @returns
   */
  async runPayloader(): Promise<IIndicativeEnrichmentPayload> {
    const payload: IIndicativeEnrichmentPayload = {
      id: this.payload.identityId,
      ...JSON.parse(this.payload.message),
      serviceBundleCode: this.serviceBundleCode,
    };
    const payloader = new Payloader<IIndicativeEnrichmentPayload>();
    payloader.validate<IIndicativeEnrichmentPayload>(payload, 'indicativeEnrichment');
    this.gqldata = payloader.data;
    this.prepped = _nest.update(payload, 'lastfour', `000000000${payload.ssn.lastfour}`.slice(-9));
    console.log('gqldata: ', this.gqldata);
    console.log('prepped: ', this.prepped);
    return this.gqldata;
  }

  /**
   * Requester runner to:
   * run the indicative enrichment request which:
   *    - accepts the payload
   *    - generates the request object
   *    - generates the request xml
   */
  runRequester(): void {
    const requester = new IndicativeEnrichmentRequester(APIRequestKeys.INDICATIVE_ENRICHMENT, this.prepped);
    this.reqXML = requester.createRequest();
    console.log('reqXML: ', this.reqXML);
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
    const soap = new SoapV2();
    await soap.sendRequest(agent, auth, this.action, this.parserOptions, this.reqXML);
    const responder = new IndicativeEnrichmentResponder();
    responder.xml = soap.response;
    responder.parseResponse(this.parserOptions);
    this.setResponses(responder.response);
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
  setResponses(response: IIndicativeEnrichmentResponse): void {
    this.response = response;
    this.responseType = _nest.find(this.response, 'ResponseType');
    this.responseError = _nest.find(this.response, 'ErrorResponse');
    this.responseResult = _nest.find(this.response, 'IndicativeEnrichmentResult');
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

  formatDob(): void {
    const { year, month, day } = this.prepped.dob;
    const iso = dayjs(`${year}-${month}-${day}`, 'YYYY-MMM-D');
    this.prepped.dobformatted = iso.format('YYYY-MM-DD');
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
