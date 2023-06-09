import * as https from 'https';
import { Nested as _nest } from '@bravecredit/brave-sdk';
import { SyncV2 } from 'libs/utils/sync/SyncV2';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { FulfillRequester } from 'libs/transunion/fulfill/legacy/FulfillRequester';
import { FulfillResponder } from 'libs/transunion/fulfill/legacy/FulfillResponder';
import { qryGetDataForFulfill } from 'libs/queries';
import { IGenericRequest, IProxyRequest } from 'libs/interfaces';
import { DEFAULT_PARSER_OPTIONS } from 'libs/utils/parser/options';
import { IProxyHandlerResponse } from 'libs/interfaces/api/proxy-handler.interfaces';
import { TUReportResponseInput, UpdateAppDataInput } from 'src/api/api.service';
import { LoggerTransactionals } from 'libs/utils/logger/LoggerTransactionals';
import { CreditReportPublisher } from 'libs/transunion/credit-report-service/CreditReportPublisher';
import { APIRequest } from 'libs/models/api-request.model';
import { IFulfillGraphQLResponse, IFulfillResponse, IFulfillResult } from 'libs/transunion/fulfill/fulfill.interface';
import { MergeReport } from '@bravecredit/brave-sdk';

export class FulfillV2 extends LoggerTransactionals implements APIRequest {
  public reqXML: string;
  public resXML: string;
  public gqldata: IFulfillGraphQLResponse;
  public prepped = null;
  public action = 'Fulfill';
  public parserOptions = DEFAULT_PARSER_OPTIONS;
  public response: IFulfillResponse;
  public responseType: string;
  public responseError: any;
  public results: IProxyHandlerResponse<IFulfillResult>;
  public serviceBundleCode = 'CC2BraveCreditTUReportV3Score';
  public mergeReport: MergeReport;
  public mergeReportSPO: string;

  constructor(protected payload: IProxyRequest) {
    super('Fulfill');
  }

  /**
   * API runner to:
   *  - prep the payload (via the Payloader)
   *  - map to the request data structure and generate the request XML (with the Requester)
   *  - send request, parse response, and sync response to database (with the Responder)
   *  - log the results and send back results to API
   * @returns
   */
  async run(): Promise<IProxyHandlerResponse<IFulfillResult>> {
    const { accountCode, username, message, agent, auth, identityId } = this.payload;
    try {
      await this.runPayloader();
      const requester = new FulfillRequester(this.gqldata, this.serviceBundleCode);
      this.runRequester<FulfillRequester>(requester);
      const responder = new FulfillResponder();
      await this.runSendAndSync<FulfillResponder>(agent, auth, identityId, responder);
      await this.logResults();
      return this.results;
    } catch (err) {
      console.log('error ===> ', err);
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
  async runPayloader(): Promise<IFulfillGraphQLResponse> {
    const payload: IGenericRequest = { id: this.payload.identityId };
    const payloader = new Payloader<IFulfillGraphQLResponse>();
    payloader.validate<IGenericRequest>(payload, 'getRequest');
    const qry = qryGetDataForFulfill;
    await payloader.prep<IGenericRequest>(qry, payload);
    this.gqldata = payloader.data;
    console.log('data: ', this.gqldata);
    return this.gqldata;
  }

  /**
   * Requester runner to:
   *  - generate the request (map to TU datastructure)
   *  - generate the XML
   * @param requester
   * @returns
   */
  runRequester<T extends FulfillRequester>(requester: T): string {
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
  async runSendAndSync<T extends FulfillResponder>(
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
      this.setSuccessResults(synched);
    } else {
      this.setFailedResults();
    }
  }

  setResponses(response: IFulfillResponse): void {
    this.response = response;
    this.responseType = _nest.find(this.response, 'ResponseType');
    this.responseError = _nest.find(this.response, 'ErrorResponse');
  }

  setMergeReportItems(responder: FulfillResponder): void {
    this.mergeReport = responder.mergeReport;
    this.mergeReportSPO = responder.mergeReportSPO;
  }

  setSuccessResults(synched: boolean): void {
    const data = _nest.find<IFulfillResult>(this.response, 'FulfillResult');
    this.results = synched
      ? { success: true, error: null, data: data }
      : { success: false, error: 'failed to sync data to db' };
  }

  setFailedResults(): void {
    this.results = { success: false, error: this.responseError };
  }

  parseReport(enriched: UpdateAppDataInput): { data: TUReportResponseInput; spo: string; report: MergeReport } {
    const data = _nest.find<TUReportResponseInput>(enriched, 'enrollMergeReport');
    const spo = _nest.find<string>(data, 'serviceProductObject');
    const report = new MergeReport(JSON.parse(spo));
    return { data, spo, report };
  }

  async publishReport(spo: string, id: string): Promise<void> {
    const publisher = new CreditReportPublisher(spo);
    await publisher.publish(id);
  }

  /**
   * Log the transunion results and generic results
   */
  async logResults(): Promise<void> {
    const id = this.payload.identityId;
    this.log(id, { ...this }, 'TRANSUNION');
    await this.log(id, this.results, 'GENERIC');
  }
}
