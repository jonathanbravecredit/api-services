import { Payloader } from 'libs/utils/payloader/Payloader';
import { IProxyRequest } from 'libs/interfaces';
import { APIRequest } from 'libs/models/api-request.model';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { TUAPIProcessor } from 'libs/transunion/tu/tu-api';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { GetTrendingDataResponder } from 'libs/transunion/get-trending-data/subclasses/get-trending-data.responder';
import { GetTrendingDataRequester } from 'libs/transunion/get-trending-data/subclasses/get-trending-data.requester';
import {
  IGetTrendingDataResponse,
  IGetTrendingDataResult,
  IGetTrendingDataSchema,
} from 'libs/transunion/get-trending-data/get-trending-data.interface';

export class GetTrendingDataV2
  extends TUAPIProcessor<IGetTrendingDataSchema, any, IGetTrendingDataResponse, IGetTrendingDataResult>
  implements APIRequest
{
  public action = 'GetTrendingData';
  public schema = 'getTrendingDataRequest';
  public resultKey = 'GetTrendingDataResult';
  public serviceBundleCode = '';

  constructor(protected payload: IProxyRequest) {
    super('GetTrendingData', payload, new GetTrendingDataResponder(), new Payloader<any>(), new SoapV2());
  }

  /**
   * Requester runner to:
   * run the indicative enrichment request which:
   *    - accepts the payload
   *    - generates the request object
   *    - generates the request xml
   */
  runRequester(): void {
    const requester = new GetTrendingDataRequester(APIRequestKeys.GET_TRENDING_DATA, this.prepped);
    this.reqXML = requester.createRequest();
    console.log('reqXML: ', this.reqXML);
  }
}
