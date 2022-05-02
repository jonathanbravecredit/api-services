import * as https from 'https';
import { SyncV2 } from 'lib/utils/sync/SyncV2';
import { SoapV2 } from 'lib/utils/soap-aid/SoapV2';
import { Nested as _nest } from 'lib/utils/helpers/Nested';
import { Payloader } from 'lib/utils/payloader/Payloader';
import { qryGetDataForEnrollment } from 'lib/queries';
import { IEnrollGraphQLResponse, IEnrollResponse, IGenericRequest, IProxyRequest } from 'lib/interfaces';
import { DEFAULT_PARSER_OPTIONS } from 'lib/utils/parser/options';
import { IProxyHandlerResponse } from 'lib/interfaces/api/proxy-handler.interfaces';
import { EnrollRequester } from 'lib/transunion/enroll/subclasses/EnrollRequester';
import { EnrollResponder } from 'lib/transunion/enroll/subclasses/EnrollResponder';
import { LoggerTransactionals } from 'lib/utils/logger/LoggerTransactionals';
import { MergeReport } from 'lib/models/MergeReport/MergeReport';
import { CreditReportPublisher } from 'lib/transunion/credit-report-service/CreditReportPublisher';
import { APIRequest } from 'lib/models/api-request.model';

export class EnrollV2 extends LoggerTransactionals implements APIRequest {
  public reqXML: string;
  public resXML: string;
  public gqldata: IEnrollGraphQLResponse;
  public prepped = null;
  public action = 'Enroll';
  public parserOptions = DEFAULT_PARSER_OPTIONS;
  public response: IEnrollResponse;
  public responseType: string;
  public responseError: any;
  public results: IProxyHandlerResponse<{ report: MergeReport }>;
  public serviceBundleCode = 'CC2BraveCreditTUReportV3Score';
  public mergeReport: MergeReport;
  public mergeReportSPO: string;

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
  async run(): Promise<IProxyHandlerResponse<{ report: MergeReport }>> {
    const { accountCode, username, message, agent, auth, identityId } = this.payload;
    try {
      await this.runPayloader(identityId);
      const requester = new EnrollRequester(this.gqldata, this.serviceBundleCode);
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
    this.gqldata = payloader.data;
    return this.gqldata;
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
    this.setResponses(responder.response);
    this.setMergeReportItems(responder);
    if (this.responseType.toLowerCase() === 'success') {
      const synched = await sync.syncData(responder.enriched);
      await this.publishReport(this.mergeReportSPO, id);
      this.setSuccessResults(synched, this.mergeReport);
    } else {
      this.setFailedResults();
    }
  }

  setResponses(response: IEnrollResponse): void {
    this.response = response;
    this.responseType = _nest.find(this.response, 'ResponseType');
    this.responseError = _nest.find(this.response, 'ErrorResponse');
  }

  setMergeReportItems(responder: EnrollResponder): void {
    this.mergeReport = responder.mergeReport;
    this.mergeReportSPO = responder.mergeReportSPO;
  }

  setSuccessResults(synched: boolean, data: MergeReport): void {
    this.results = synched
      ? { success: true, error: null, data: { report: data } }
      : { success: false, error: 'failed to sync data to db' };
  }

  setFailedResults(): void {
    this.results = { success: false, error: this.responseError };
  }

  async publishReport(spo: string, id: string): Promise<void> {
    const publisher = new CreditReportPublisher(spo);
    await publisher.publish(id);
  }

  async logResults(id: string): Promise<void> {
    this.log(id, { ...this }, 'TRANSUNION');
  }
}
