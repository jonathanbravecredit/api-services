import * as dayjs from 'dayjs';
import { IMergeReport, MergeReport, Nested as _nest } from '@bravecredit/brave-sdk';
import { IGenericRequest, IGetDisputeStatusResult, IProxyRequest } from 'libs/interfaces';
import { IProxyHandlerResponse } from 'libs/interfaces/api/proxy-handler.interfaces';
import { getDisputeEnrollment, getFulfilledOn } from 'libs/proxy/proxy-queries';
import { EnrollDisputesV2 } from 'libs/transunion/enroll-disputes/enroll-disputes-v2';
import { DB } from 'libs/utils/db/db';
import { LoggerTransactionals } from 'libs/utils/logger/LoggerTransactionals';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { FulfillDisputesV3 } from 'libs/transunion/fulfill-disputes/fulfill-disputes-v3';
import { GetDisputeStatusV2 } from 'libs/transunion/get-dispute-status/get-dispute-status-v2';

export class DisputePreflightCheckV2 extends LoggerTransactionals {
  public payloader = new Payloader<any>();
  public schema = 'getRequest';
  public prepped: IGenericRequest;
  public results: IProxyHandlerResponse<any>;
  public db = DB;
  public enrolled: boolean = false;
  public refresh: boolean = false;
  public report: { report: IMergeReport };
  public response: IProxyHandlerResponse<{ report: IMergeReport | null }>;

  constructor(protected payload: IProxyRequest, public action = 'DisputePreflightCheck') {
    super('DisputePreflightCheck');
  }

  async run(): Promise<any> {
    try {
      this.runPayloader();
      await this.checkEnrollment();
      await this.enroll();
      await this.checkFulfill();
      await this.fulfill();
      await this.getDisputeStatus();
      await this.logResults();
      return this.results;
    } catch (err) {
      this.logGenericError(this.prepped.id, err);
      this.results = { success: false, error: err, data: null };
      return this.results;
    }
  }

  /**
   * Payloader runner for data prep
   *  - validate the payload against the schema
   *  - Does NOT gather GQL data if needed (must implement independently)
   * @returns
   */
  runPayloader(): void {
    const payload = this.prepPayload();
    this.payloader.validate<IGenericRequest>(payload, this.schema);
    this.prepped = payload;
    console.log('prepped: ', this.prepped);
  }

  /**
   * Prep the payload to match the schema
   * @returns
   */
  prepPayload() {
    return {
      id: this.payload.identityId,
    };
  }

  async checkEnrollment(): Promise<void> {
    console.log('*** IN GET ENROLL STATUS ***');
    const { data } = await getDisputeEnrollment(this.prepped);
    this.enrolled = !data ? false : _nest.find<boolean>(data, 'disputeEnrolled');
    console.log('DisputePreflightCheck:enrolled ===> ', this.enrolled);
  }

  async enroll(): Promise<void> {
    if (this.enrolled) return;
    const enrollDisputes = new EnrollDisputesV2(this.payload);
    const { success, error, data } = await enrollDisputes.run();
    if (!success) throw error;
  }

  async checkFulfill(): Promise<void> {
    console.log('*** IN REFRESH ***');
    const { data } = await getFulfilledOn(this.prepped);
    const fulfilledOn = !data ? false : _nest.find<string>(data, 'fulfilledOn');
    console.log('DisputePreflightCheck:fulfilledOn ===> ', fulfilledOn);
    this.refresh = fulfilledOn ? (dayjs(new Date()).diff(dayjs(fulfilledOn), 'hour') >= 24 ? true : false) : true;
  }

  async fulfill(): Promise<void> {
    if (!this.refresh) return;
    const fulfill = new FulfillDisputesV3(this.payload);
    await fulfill.run();
    this.report = { report: fulfill.mergeReport as unknown as IMergeReport };
  }

  async getDisputeStatus(): Promise<void> {
    const getDisputeStatus = new GetDisputeStatusV2(this.payload);
    const { success, error } = await getDisputeStatus.run();
    this.response = success
      ? { success: true, error: null, data: this.report }
      : { success: false, error: error, data: { report: null } };
  }

  /**
   * logs the results of the API call
   */
  async logResults(): Promise<void> {
    const id = this.payload.identityId;
    await this.log(id, this.results, 'GENERIC');
  }
}
