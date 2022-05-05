import * as dayjs from 'dayjs';
import { Nested as _nest } from 'libs/utils/helpers/Nested';
import { Payloader } from 'libs/utils/payloader/Payloader';
import {
  IGenericRequest,
  IGetDisputeHistoryGraphQLResponse,
  IGetDisputeHistoryResponse,
  IGetDisputeHistoryResult,
  IGetDisputeHistorySchema,
  IGetDisputeStatusGraphQLResponse,
  IProxyRequest,
} from 'libs/interfaces';
import { APIRequest } from 'libs/models/api-request.model';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { TUAPIProcessor } from 'libs/transunion/tu/tu-api';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { qryGetDataForGetDisputeHistory } from 'libs/queries/custom-graphql';
import { GetDisputeHistoryResponder } from 'libs/transunion/get-dispute-history /subclasses/get-dispute-history.responder';
import { GetDisputeHistoryRequester } from 'libs/transunion/get-dispute-history /subclasses/get-dispute-history.requester';

export class GetDisputeHistoryV2
  extends TUAPIProcessor<
    IGetDisputeHistorySchema,
    IGetDisputeHistoryGraphQLResponse,
    IGetDisputeHistoryResponse,
    IGetDisputeHistoryResult
  >
  implements APIRequest
{
  public action = 'GetDisputeHistory';
  public schema = 'getRequest';
  public resultKey = 'GetDisputeHistoryResult';

  constructor(protected payload: IProxyRequest) {
    super(
      'GetDisputeStatus',
      payload,
      new GetDisputeHistoryResponder(),
      new Payloader<IGetDisputeHistoryGraphQLResponse>(),
      new SoapV2(),
    );
  }

  /**
   * Payloader runner for data prep
   *  - validate the payload against the schema
   *  - gather GQL data
   * @returns
   */
  async runPayloader(): Promise<void> {
    super.runPayloader();
    await this.payloader.prep<IGenericRequest>(qryGetDataForGetDisputeHistory, this.prepped);
    this.gqldata = this.payloader.data;
    console.log('gqldata: ', this.gqldata);
    console.log('prepped: ', this.prepped);
  }

  /**
   * Requester runner to:
   * run the indicative enrichment request which:
   *    - accepts the payload
   *    - generates the request object
   *    - generates the request xml
   */
  runRequester(): void {
    const requester = new GetDisputeHistoryRequester(APIRequestKeys.GET_DISPUTE_HISTORY, this.gqldata);
    this.reqXML = requester.createRequest();
    console.log('reqXML: ', this.reqXML);
  }
}
