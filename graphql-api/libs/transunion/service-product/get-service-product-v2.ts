import * as dayjs from 'dayjs';
import { Nested as _nest } from '@bravecredit/brave-sdk';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { IProxyRequest } from 'libs/interfaces';
import { APIRequest } from 'libs/models/api-request.model';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { TUAPIProcessor } from 'libs/transunion/tu/tu-api';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { GetServiceProductResponder } from 'libs/transunion/service-product/subclasses/get-service-product.responder';
import { GetServiceProductRequester } from 'libs/transunion/service-product/subclasses/get-service-product.requester';
import {
  IGetServiceProductResponse,
  IGetServiceProductResult,
  IGetServiceProductSchema,
} from 'libs/transunion/service-product/get-service-product.interface';

// !!!! NOT WORKING AND NOT IN USE....NEEDS SERVICE BUNDLE FULFILLMENT KEY AND PRODUCT DISPLAY
export class GetServiceProductV2
  extends TUAPIProcessor<IGetServiceProductSchema, any, IGetServiceProductResponse, IGetServiceProductResult>
  implements APIRequest
{
  public action = 'GetServiceProduct';
  public schema = 'getRequest';
  public resultKey = 'GetServiceProductResult';
  public serviceBundleCode = 'CC2BraveCreditAuthentication';

  constructor(protected payload: IProxyRequest) {
    super('GetServiceProduct', payload, new GetServiceProductResponder(), new Payloader<any>(), new SoapV2());
  }
  /**
   * Requester runner to:
   * run the indicative enrichment request which:
   *    - accepts the payload
   *    - generates the request object
   *    - generates the request xml
   */
  runRequester(): void {
    const requester = new GetServiceProductRequester(APIRequestKeys.GET_AUTHENTICATION_QUESTIONS, this.prepped);
    this.reqXML = requester.createRequest();
    console.log('reqXML: ', this.reqXML);
  }
}
