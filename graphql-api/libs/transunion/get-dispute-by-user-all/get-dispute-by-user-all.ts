import { IGenericRequest } from 'libs/interfaces';
import { IProxyHandlerResponse } from 'libs/interfaces/api/proxy-handler.interfaces';
import { IProxyRequest } from 'libs/interfaces/api/proxy-query.interfaces';
import { DB } from 'libs/utils/db/db';
import { Dispute } from 'libs/utils/db/disputes/model/dispute.model';
import { LoggerTransactionals } from 'libs/utils/logger/LoggerTransactionals';
import { Payloader } from 'libs/utils/payloader/Payloader';

export class GetDisputeByUserAllV2 extends LoggerTransactionals {
  public schema = 'getRequest';
  public payloader = new Payloader<any>();
  public prepped: IGenericRequest;
  public results: IProxyHandlerResponse<any>;
  public db = DB;
  constructor(protected payload: IProxyRequest, public action = 'GetAllDisputesByUser') {
    super('GetAllDisputesByUser');
  }

  async run(): Promise<any> {
    try {
      this.runPayloader();
      const resp = await this.queryDisputes();
      this.results = { success: true, error: null, data: resp };
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
    console.log('prepped: ', JSON.stringify(this.prepped));
  }

  /**
   * Prep the payload to match the schema
   * @returns
   */
  prepPayload() {
    const msg = this.payload.message || '{}';
    return {
      id: this.payload.identityId,
      ...JSON.parse(msg),
    };
  }

  async queryDisputes(): Promise<Dispute[]> {
    return await this.db.disputes.list(this.prepped.id);
  }
  /**
   * logs the results of the API call
   */
  async logResults(): Promise<void> {
    const id = this.payload.identityId;
    await this.log(id, this.results, 'GENERIC');
  }
}
