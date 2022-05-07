import * as https from 'https';
import { v4 } from 'uuid';
import { DB as db } from 'libs/utils/db/db';
import { Nested as _nest } from '@bravecredit/brave-sdk';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { qryGetDataForGetInvestigationResults } from 'libs/queries';
import { APIRequest } from 'libs/models/api-request.model';
import { TUAPIProcessor } from 'libs/transunion/tu/tu-api';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { GetInvestigationResultsResponder } from 'libs/transunion/get-investigation-results/subclasses/get-investigation-results.responder';
import { GetInvestigationResultsRequester } from 'libs/transunion/get-investigation-results/subclasses/get-investigation-results.requester';
import { IProxyRequest } from 'libs/interfaces';
import {
  IGetInvestigationResultsSchema,
  IGetInvestigationResultsGraphQLResponse,
  IGetInvestigationResultsResponse,
  IGetInvestigationResultsResult,
  IGetInvestigationEnrichPayload,
} from 'libs/transunion/get-investigation-results/get-investigation-results.interface';

export class GetInvestigationResultsV2
  extends TUAPIProcessor<
    IGetInvestigationResultsSchema,
    IGetInvestigationResultsGraphQLResponse,
    IGetInvestigationResultsResponse,
    IGetInvestigationResultsResult
  >
  implements APIRequest
{
  public action = 'GetInvestigationResults';
  public schema = 'getInvestigationResultsRequest';
  public resultKey = 'GetInvestigationResultsResult';
  public serviceBundleCode = '';

  constructor(protected payload: IProxyRequest, action: string = 'GetInvestigationResults') {
    super(
      action,
      payload,
      new GetInvestigationResultsResponder(),
      new Payloader<IGetInvestigationResultsGraphQLResponse>(),
      new SoapV2(),
    );
  }

  /**
   * Payloader runner to:
   *  - validate the payload
   *  - prep the payload
   * @returns
   */
  async runPayloader(): Promise<void> {
    const payload = this.prepPayload();
    this.payloader.validate<IGetInvestigationResultsSchema>(payload, this.schema);
    await this.payloader.prep<IGetInvestigationResultsSchema>(qryGetDataForGetInvestigationResults, payload);
    this.gqldata = this.payloader.data;
    this.prepped = payload;
    console.log('data: ', this.gqldata);
    console.log('prepped: ', this.prepped);
  }

  /**
   * Requester runner to:
   *  - generate the request (map to TU datastructure)
   *  - generate the XML
   * @returns
   */
  runRequester(): void {
    const requester = new GetInvestigationResultsRequester(APIRequestKeys.GET_INVESTIGATION_RESULTS, {
      ...this.gqldata,
      disputeId: this.prepped.disputeId,
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
    await super.runSendAndSync(agent, auth);
    this.setResponses(this.responder.response);
    const bundle = {
      disputeId: this.prepped.disputeId,
      getInvestigationResult: this.results.data,
    } as IGetInvestigationEnrichPayload;
    if (this.responseType.toLowerCase() === 'success') {
      const synced = await this.updateInvestigationResultsDB(this.prepped.id, bundle);
      this.setSuccessResultsSync(synced);
    } else {
      this.setFailedResults();
    }
  }

  setSuccessResultsSync(synced: boolean): void {
    const data = _nest.find<IGetInvestigationResultsResult>(this.response, 'GetInvestigationResultsResult');
    this.results = synced
      ? { success: true, error: null, data: data }
      : { success: false, error: 'failed to sync data to db' };
  }

  async updateInvestigationResultsDB(id: string, data: IGetInvestigationEnrichPayload): Promise<boolean> {
    if (!data) return;
    const sub = id;
    const cbID = v4();
    const irID = v4();
    const irReport = _nest.find<string>(data, 'InvestigationResults');
    const cbReport = _nest.find<string>(data, 'CreditBureau');
    const disputeId = _nest.find<string>(data, 'disputeId');
    const newIR = {
      id: irID,
      userId: sub,
      record: JSON.stringify(irReport),
      createdOn: null,
      modifiedOn: null,
    };

    const newCB = {
      id: cbID,
      userId: sub,
      record: JSON.stringify(cbReport),
      createdOn: null,
      modifiedOn: null,
    };

    try {
      await db.investigationResults.create(newIR);
      await db.creditBureauResults.create(newCB);
      await db.disputes.updateResults(sub, disputeId, cbID, irID);
      return true;
    } catch (err) {
      console.log('updateInvestigationResultsDB error ===> ', err);
      return false;
    }
  }
}
