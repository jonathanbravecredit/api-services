import * as https from 'https';
import { SyncV2 } from 'lib/utils/sync/SyncV2';
import { SoapV2 } from 'lib/utils/soap-aid/SoapV2';
import { Nested as _nest } from 'lib/utils/helpers/Nested';
import { Payloader } from 'lib/utils/payloader/Payloader';
import { qryGetDataForEnrollment } from 'lib/queries';
import {
  IEnrollGraphQLResponse,
  IEnrollResponse,
  IEnrollResult,
  IGenericRequest,
  IMergeReport,
  IProxyRequest,
} from 'lib/interfaces';
import { DEFAULT_PARSER_OPTIONS } from 'lib/utils/parser/options';
import { IProxyHandlerResponse } from 'lib/interfaces/api/proxy-handler.interfaces';
import { EnrollRequester } from 'lib/transunion/enroll/subclasses/EnrollRequester';
import { EnrollResponder } from 'lib/transunion/enroll/subclasses/EnrollResponder';
import { LoggerTransactionals } from 'lib/utils/logger/LoggerTransactionals';

export class EnrollV2 extends LoggerTransactionals {
  protected reqXML: string;
  protected resXML: string;
  protected data: IEnrollGraphQLResponse;
  protected action = 'Enroll';
  protected parserOptions = DEFAULT_PARSER_OPTIONS;
  protected response: IEnrollResponse;
  protected responseType: string;
  protected responseError: any;
  protected results: IProxyHandlerResponse<{ report: IMergeReport }>;

  constructor(protected payload: IProxyRequest) {
    super('Enroll');
  }

  /**
   * API runner to:
   *  - prep the payload (via the Payloader)
   *  - map to the request data structure and generate the request XML (with the Requester)
   *  - send request, parse response, and sync response to database (with the Responder)
   *  - log the results and send back results to API
   * @returns
   */
  async run(): Promise<IProxyHandlerResponse<{ report: IMergeReport }>> {
    const { accountCode, username, message, agent, auth, identityId } = this.payload;
    try {
      await this.runPayloader(identityId);
      const requester = new EnrollRequester(this.data);
      this.runRequester<EnrollRequester>(requester);
      const responder = new EnrollResponder();
      await this.runSendAndSync<EnrollResponder>(agent, auth, identityId, responder);
      await this.logResults(identityId);
      return this.results;
    } catch (err) {
      console.log('error ===> ', err);
      await this.logGenericError(identityId, err);
      return { success: false, data: null, error: err };
    }
  }

  /**
   * Payloader runner to:
   *  - validate the payload
   *  - prep the payload
   * @returns
   */
  async runPayloader(id: string): Promise<IEnrollGraphQLResponse> {
    const payload: IGenericRequest = { id };
    const payloader = new Payloader<IEnrollGraphQLResponse>();
    payloader.validate<IGenericRequest>(payload, 'getRequest');
    const qry = qryGetDataForEnrollment;
    await payloader.prep<IGenericRequest>(qry, payload);
    this.data = payloader.data;
    return this.data;
  }

  /**
   * Requester runner to:
   *  - generate the request (map to TU datastructure)
   *  - generate the XML
   * @param requester
   * @returns
   */
  runRequester<T extends EnrollRequester>(requester: T): string {
    requester.generateRequest();
    requester.generateXML();
    const { xml } = requester;
    this.reqXML = xml;
    return this.reqXML;
  }

  /**
   * Send and Sync runner to:
   *  - use the soap client to send the request
   *  - use the sync client to get a copy of the current state
   *  - use the responder to parse the response
   *  - use the responder to enrich the current state with new data
   *  - set the response properties and create results
   * @param agent
   * @param auth
   * @param id
   * @param responder
   */
  async runSendAndSync<T extends EnrollResponder>(
    agent: https.Agent,
    auth: string,
    id: string,
    responder: T,
  ): Promise<void> {
    const soap = new SoapV2();
    await soap.sendRequest(agent, auth, this.action, this.parserOptions, this.reqXML);
    const sync = new SyncV2();
    await sync.getCleanData({ id });
    responder.xml = soap.response;
    responder.parseResponse(this.parserOptions);
    responder.enrichData(sync.clean);
    this.response = responder.response;
    this.responseType = _nest.find(this.response, 'ResponseType');
    this.responseError = _nest.find(this.response, 'ErrorResponse');
    if (this.responseType.toLowerCase() === 'success') {
      const synched = await sync.syncData(responder.enriched);
      const data = _nest.find<IMergeReport>(responder.enriched, 'enrollMergeReport');
      this.setSuccessResults(synched, data);
    } else {
      this.setFailedResults();
    }
  }

  setSuccessResults(synched: boolean, data: IMergeReport): void {
    this.results = synched
      ? { success: true, error: null, data: { report: data } }
      : { success: false, error: 'failed to sync data to db' };
  }

  setFailedResults(): void {
    this.results = { success: false, error: this.responseError };
  }

  async logResults(id: string): Promise<void> {
    this.log(id, { ...this }, 'TRANSUNION');
  }
}
