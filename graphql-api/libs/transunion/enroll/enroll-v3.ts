import * as dayjs from 'dayjs';
import * as https from 'https';
import { SyncV2 } from 'libs/utils/sync/SyncV2';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { Nested as _nest } from '@bravecredit/brave-sdk';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { qryGetDataForEnrollment } from 'libs/queries';
import { IGenericRequest, IProxyRequest } from 'libs/interfaces';
import { IProxyHandlerResponse } from 'libs/interfaces/api/proxy-handler.interfaces';
import { CreditReportPublisher } from 'libs/transunion/credit-report-service/CreditReportPublisher';
import { APIRequest } from 'libs/models/api-request.model';
import { TUAPIProcessor } from 'libs/transunion/tu/tu-api';
import { EnrollResponder } from 'libs/transunion/enroll/subclasses/enroll.responder';
import { EnrollRequester } from 'libs/transunion/enroll/subclasses/enroll.requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { DobInput } from '@bravecredit/brave-sdk/dist/types/graphql-api';
import {
  IEnrollSchema,
  IEnrollGraphQLResponse,
  IEnrollResponse,
  IEnrollResult,
} from 'libs/transunion/enroll/enroll.interface';
import { MergeReport } from '@bravecredit/brave-sdk';

export class EnrollV3
  extends TUAPIProcessor<IEnrollSchema, IEnrollGraphQLResponse, IEnrollResponse, IEnrollResult>
  implements APIRequest
{
  public responder: EnrollResponder;
  public results: IProxyHandlerResponse<unknown>;
  public action = 'Enroll';
  public schema = 'getBundleRequest';
  public resultKey = 'EnrollResult';
  public serviceBundleCode = 'CC2BraveCreditTUReportV3Score';

  public mergeReport: MergeReport;
  public mergeReportSPO: string;

  constructor(protected payload: IProxyRequest, action: string = 'Enroll') {
    super(action, payload, new EnrollResponder(), new Payloader<IEnrollGraphQLResponse>(), new SoapV2());
  }

  /**
   * Payloader runner for data prep
   *  - validate the payload against the schema
   *  - gather GQL data if needed (must implement independently)
   * @returns
   */
  async runPayloader(): Promise<void> {
    super.runPayloader();
    await this.payloader.prep<IGenericRequest>(qryGetDataForEnrollment, this.prepped);
    this.gqldata = this.payloader.data;
    console.log('gqldata: ', this.gqldata);
    console.log('prepped: ', this.prepped);
  }

  /**
   * Requester runner to:
   *  - generate the request (map to TU datastructure)
   *  - generate the XML
   * @returns
   */
  runRequester(): void {
    this.formatDob();
    const requester = new EnrollRequester(APIRequestKeys.ENROLL, {
      ...this.gqldata,
      serviceBundleCode: this.serviceBundleCode,
    });
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
    await this.soap.sendRequest(agent, auth, this.action, this.parserOptions, this.reqXML);
    const sync = new SyncV2();
    await sync.getCleanData({ id: this.payload.identityId });
    this.responder.xml = this.soap.response;
    this.responder.parseResponse(this.parserOptions);
    this.responder.enrichData(sync.clean);
    this.setResponses(this.responder.response);
    this.setMergeReportItems(this.responder);
    if (this.responseType.toLowerCase() === 'success') {
      const synched = await sync.syncData(this.responder.enriched);
      await this.publishReport(this.mergeReportSPO, this.payload.identityId);
      this.setSuccessResultsSync(synched, this.mergeReport);
    } else {
      this.setFailedResults();
    }
  }

  setMergeReportItems(responder: EnrollResponder): void {
    this.mergeReport = responder.mergeReport;
    this.mergeReportSPO = responder.mergeReportSPO;
  }

  setSuccessResultsSync(synched: boolean, data: MergeReport): void {
    this.results = synched
      ? { success: true, error: null, data: { report: data } }
      : { success: false, error: 'failed to sync data to db' };
  }

  async publishReport(spo: string, id: string): Promise<void> {
    const publisher = new CreditReportPublisher(spo);
    await publisher.publish(id);
  }
  /**
   * TU requires date format in YYYY-MMM-D
   *  ex: 1980-Nov-1
   */
  formatDob(): void {
    const { year, month, day } = _nest.find<DobInput>(this.gqldata, 'dob');
    const iso = dayjs(`${year}-${month}-${day}`, 'YYYY-MMM-D');
    this.gqldata.dobformatted = iso.format('YYYY-MM-DD');
  }
}
