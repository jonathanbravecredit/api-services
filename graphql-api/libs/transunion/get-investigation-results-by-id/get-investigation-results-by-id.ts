import { InvestigationResult } from '@bravecredit/brave-sdk';
import { IGenericRequest } from 'libs/interfaces';
import { IProxyHandlerResponse } from 'libs/interfaces/api/proxy-handler.interfaces';
import { IProxyRequest } from 'libs/interfaces/api/proxy-query.interfaces';
import { IGetInvestigationResultsByIdSchema } from 'libs/transunion/get-investigation-results-by-id/get-investigation-results-by-id.interface';
import { DB } from 'libs/utils/db/db';
import { LoggerTransactionals } from 'libs/utils/logger/LoggerTransactionals';
import { Payloader } from 'libs/utils/payloader/Payloader';

export class GetInvestigationResultsByIdV2 extends LoggerTransactionals {
  public payloader = new Payloader<any>();
  public schema = 'getInvestigationResultsRequestById';
  public prepped: IGetInvestigationResultsByIdSchema;
  public results: IProxyHandlerResponse<any>;
  public db = DB;
  constructor(protected payload: IProxyRequest, public action = 'GetInvestigationResultsById') {
    super('GetInvestigationResultsById');
  }

  async run(): Promise<any> {
    try {
      this.runPayloader();
      const resp = await this.query();
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
      userId: this.payload.identityId,
      ...JSON.parse(msg),
    };
  }

  async query(): Promise<InvestigationResult> {
    return await this.db.investigationResults.get(this.prepped.id, this.prepped.userId);
  }
  /**
   * logs the results of the API call
   */
  async logResults(): Promise<void> {
    const id = this.payload.identityId;
    await this.log(id, this.results, 'GENERIC');
  }
}
