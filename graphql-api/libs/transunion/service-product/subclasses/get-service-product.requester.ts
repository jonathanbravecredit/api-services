import { APIRequester } from 'libs/models/api-requester.model';
import { IGetServiceProductSchema } from 'libs/transunion/service-product/get-service-product.interface';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';

export class GetServiceProductRequester extends TURequester<IGetServiceProductSchema> implements APIRequester {
  constructor(requestKey: APIRequestKeys, payload: IGetServiceProductSchema) {
    super(requestKey, payload);
  }
}
