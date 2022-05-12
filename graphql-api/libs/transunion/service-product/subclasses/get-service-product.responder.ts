import { IGetServiceProductResponse } from 'libs/transunion/service-product/get-service-product.interface';
import { TUResponder } from 'libs/transunion/tu/tu-responder';

export class GetServiceProductResponder extends TUResponder<IGetServiceProductResponse, any> {
  constructor() {
    super();
  }
}
