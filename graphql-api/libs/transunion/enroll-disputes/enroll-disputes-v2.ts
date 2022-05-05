import * as https from 'https';
import { IEnrollResult, IProxyRequest } from 'libs/interfaces';
import { IProxyHandlerResponse } from 'libs/interfaces/api/proxy-handler.interfaces';
import { EnrollV3 } from 'libs/transunion/enroll/enroll-v3';
import { SyncV2 } from 'libs/utils/sync/SyncV2';

export class EnrollDisputesV2 extends EnrollV3 {
  public results: IProxyHandlerResponse<IEnrollResult>;
  public serviceBundleCode = 'CC2BraveCreditTUDispute';

  constructor(protected payload: IProxyRequest) {
    super(payload, 'EnrollDisputes');
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
    if (this.responseType.toLowerCase() === 'success') {
      const synched = await sync.syncData(this.responder.enriched);
      await this.publishReport(this.mergeReportSPO, this.payload.identityId);
      this.setSuccessResultsSync(synched, this.mergeReport);
    } else {
      this.results =
        `${this.responseError.Code}` == '103045'
          ? { success: true, error: null, data: null }
          : { success: false, error: this.responseError, data: null };
    }
  }
}
