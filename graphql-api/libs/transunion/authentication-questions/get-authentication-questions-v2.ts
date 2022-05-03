import * as https from 'https';
import { Nested as _nest } from 'libs/utils/helpers/Nested';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { IProxyRequest } from 'libs/interfaces';
import { DEFAULT_PARSER_OPTIONS } from 'libs/utils/parser/options';
import { IProxyHandlerResponse } from 'libs/interfaces/api/proxy-handler.interfaces';
import { LoggerTransactionals } from 'libs/utils/logger/LoggerTransactionals';
import { APIRequest } from 'libs/models/api-request.model';
import {
  IGetAuthenticationQuestionsPayload,
  IGetAuthenticationQuestionsResponse,
  IGetAuthenticationQuestionsResult,
} from 'libs/transunion/authentication-questions/get-authentication-questions.interface';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { GetAuthenticationQuestionsRequester } from 'libs/transunion/authentication-questions/subclasses/get-authentication-questions.requester';
import { GetAuthenticationQuestionsResponder } from 'libs/transunion/authentication-questions/subclasses/get-authentication-questions.responder';

export class GetAuthenticationQuestionsV2 extends LoggerTransactionals implements APIRequest {
  public reqXML: string;
  public resXML: string;
  public gqldata: any;
  public prepped: IGetAuthenticationQuestionsPayload;
  public action = 'GetAuthenticationQuestions';
  public parserOptions = DEFAULT_PARSER_OPTIONS;
  public response: IGetAuthenticationQuestionsResponse; //IFulfillResponse;
  public responseType: string;
  public responseError: any;
  public responseResult: IGetAuthenticationQuestionsResult;
  public results: IProxyHandlerResponse<IGetAuthenticationQuestionsResult>;
  public serviceBundleCode = 'CC2BraveCreditAuthentication';

  constructor(protected payload: IProxyRequest) {
    super('GetAuthenticationQuestions');
  }

  /**
   * API runner to:
   *  - prep the payload (via the Payloader)
   *  - map to the request data structure and generate the request XML (with the Requester)
   *  - send request, parse response, and sync response to database (with the Responder)
   *  - log the results and send back results to API
   * @returns
   */
  async run(): Promise<IProxyHandlerResponse<IGetAuthenticationQuestionsResult>> {
    const { agent, auth, identityId } = this.payload;
    try {
      await this.runPayloader();
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
  async runPayloader(): Promise<IGetAuthenticationQuestionsPayload> {
    const payload: IGetAuthenticationQuestionsPayload = {
      id: this.payload.identityId,
      ...JSON.parse(this.payload.message),
      serviceBundleCode: this.serviceBundleCode,
    };
    const payloader = new Payloader<IGetAuthenticationQuestionsPayload>();
    payloader.validate<IGetAuthenticationQuestionsPayload>(payload, 'getAuthenticationQuestionsRequest');
    this.gqldata = payloader.data;
    this.prepped = payload;
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
    const requester = new GetAuthenticationQuestionsRequester(
      APIRequestKeys.GET_AUTHENTICATION_QUESTIONS,
      this.prepped,
    );
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
    const responder = new GetAuthenticationQuestionsResponder();
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
  setResponses(response: IGetAuthenticationQuestionsResponse): void {
    this.response = response;
    this.responseType = _nest.find(this.response, 'ResponseType');
    this.responseError = _nest.find(this.response, 'ErrorResponse');
    this.responseResult = _nest.find(this.response, 'GetAuthenticationQuestionsResult');
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
