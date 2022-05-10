import * as dayjs from 'dayjs';
import { Nested as _nest } from '@bravecredit/brave-sdk';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { IGenericRequest, IProxyRequest } from 'libs/interfaces';
import {
  IGetDisputeStatusSchema,
  IGetDisputeStatusGraphQLResponse,
  IGetDisputeStatusResponse,
  IGetDisputeStatusResult,
} from 'libs/transunion/get-dispute-status/get-dispute-status.interface';
import { APIRequest } from 'libs/models/api-request.model';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { TUAPIProcessor } from 'libs/transunion/tu/tu-api';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { DobInput } from '@bravecredit/brave-sdk/dist/types/graphql-api';
import { GetDisputeStatusResponder } from 'libs/transunion/get-dispute-status/subclasses/get-dispute-status.responder';
import { GetDisputeStatusRequester } from 'libs/transunion/get-dispute-status/subclasses/get-dispute-status.requester';
import { qryGetDataForGetDisputeStatus } from 'libs/queries/graphql-queries';

export class GetDisputeStatusV2
  extends TUAPIProcessor<
    IGetDisputeStatusSchema,
    IGetDisputeStatusGraphQLResponse,
    IGetDisputeStatusResponse,
    IGetDisputeStatusResult
  >
  implements APIRequest
{
  public action = 'GetDisputeStatus';
  public schema = 'getRequest';
  public resultKey = 'GetDisputeStatusResult';

  constructor(protected payload: IProxyRequest) {
    super(
      'GetDisputeStatus',
      payload,
      new GetDisputeStatusResponder(),
      new Payloader<IGetDisputeStatusGraphQLResponse>(),
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
    await this.payloader.prep<IGenericRequest>(qryGetDataForGetDisputeStatus, this.prepped);
    this.gqldata = this.payloader.data;
    console.log('gqldata: ', JSON.stringify(this.gqldata));
    console.log('prepped: ', JSON.stringify(this.prepped));
  }

  /**
   * Requester runner to:
   * run the indicative enrichment request which:
   *    - accepts the payload
   *    - generates the request object
   *    - generates the request xml
   */
  runRequester(): void {
    this.formatDob();
    const requester = new GetDisputeStatusRequester(APIRequestKeys.GET_DISPUTE_STATUS, this.gqldata);
    this.reqXML = requester.createRequest();
    console.log('reqXML: ', this.reqXML);
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
