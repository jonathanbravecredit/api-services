import * as https from 'https';
import { Nested as _nest } from '@bravecredit/brave-sdk';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { IGenericRequest, IProxyRequest } from 'libs/interfaces';
import { IProxyHandlerResponse } from 'libs/interfaces/api/proxy-handler.interfaces';
import { APIRequest } from 'libs/models/api-request.model';
import { TUAPIProcessor } from 'libs/transunion/tu/tu-api';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { CancelEnrollmentResponder } from 'libs/transunion/cancel-enrollment/subclasses/cancel-enrollment.responder';
import { qryGetCancelEnrollment } from 'libs/queries/graphql-queries';
import { CancelEnrollmentRequester } from 'libs/transunion/cancel-enrollment/subclasses/cancel-enrollment.requester';
import { updateEnrollmentStatus } from 'libs/utils/db/dynamo-db/dynamo';
import {
  ICancelEnrollmentSchema,
  ICancelEnrollGraphQLResponse,
  ICancelEnrollResponse,
  ICancelEnrollResult,
} from 'libs/transunion/cancel-enrollment/cancel-enrollment.interface';

export class CancelEnrollmentV2
  extends TUAPIProcessor<
    ICancelEnrollmentSchema,
    ICancelEnrollGraphQLResponse,
    ICancelEnrollResponse,
    ICancelEnrollResult
  >
  implements APIRequest
{
  public reportKey: string | undefined;
  public disputeKey: string | undefined;

  public responder: CancelEnrollmentResponder;
  public action = 'CancelEnrollment';
  public schema = 'getRequest';
  public resultKey = 'FulfillResult';
  public serviceBundleCode = 'CC2BraveCreditTUReportV3Score';

  constructor(protected payload: IProxyRequest, action: string = 'CancelEnrollment') {
    super(
      action,
      payload,
      new CancelEnrollmentResponder(),
      new Payloader<ICancelEnrollGraphQLResponse>(),
      new SoapV2(),
    );
  }

  /**
   * API runner to:
   *  - prep the payload (via the Payloader)
   *  - map to the request data structure and generate the request XML (with the Requester)
   *  - send request, parse response, and sync response to database (with the Responder)
   *  - log the results and send back results to API
   * @returns
   */
  async run(): Promise<IProxyHandlerResponse<ICancelEnrollResult>> {
    const { identityId } = this.payload;
    const results = await super.run();
    try {
      await this.updateEnrollmentStatus(identityId);
      return results;
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
  async runPayloader(): Promise<void> {
    await super.runPayloader();
    await this.payloader.prep<IGenericRequest>(qryGetCancelEnrollment, this.prepped);
    this.gqldata = this.payloader.data;
    this.setEnrollmentKeys();
    console.log('data: ', this.gqldata);
    console.log('prepped: ', this.prepped);
  }

  setEnrollmentKeys(): void {
    this.reportKey = _nest.find(this.gqldata, 'enrollmentKey');
    this.disputeKey = _nest.find(this.gqldata, 'disputeEnrollmentKey');
  }
  /**
   * Requester runner to:
   *  - generate the request (map to TU datastructure)
   *  - generate the XML
   * @returns
   */
  async runRequester(): Promise<void> {
    const { agent, auth } = this.payload;
    await this.runCancelReportEnrollment(agent, auth);
    await this.runCancelDisputeEnrollment(agent, auth);
  }

  async runCancelReportEnrollment(agent: https.Agent, auth: string): Promise<void> {
    if (!this.reportKey) return;
    const data = _nest.update(this.gqldata, 'enrollmentKey', this.reportKey);
    const reportRequester = new CancelEnrollmentRequester(APIRequestKeys.CANCEL_ENROLLMENT, data);
    this.reqXML = reportRequester.createRequest();
    await this.runSendAndSync(agent, auth);
    await this.logResults();
  }

  async runCancelDisputeEnrollment(agent: https.Agent, auth: string): Promise<void> {
    if (!this.disputeKey) return;
    const data = _nest.update(this.gqldata, 'enrollmentKey', this.disputeKey);
    const reportRequester = new CancelEnrollmentRequester(APIRequestKeys.CANCEL_ENROLLMENT, data);
    this.reqXML = reportRequester.createRequest();
    await this.runSendAndSync(agent, auth);
    await this.logResults();
  }

  async updateEnrollmentStatus(id: string): Promise<void> {
    await updateEnrollmentStatus(id, false, 'cancelled', 'Account cancelled due to inactivity or user request');
  }
}
