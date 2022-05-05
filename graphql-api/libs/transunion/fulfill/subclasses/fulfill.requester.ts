import { IFulfillGraphQLResponse } from 'libs/transunion/fulfill/fulfill.interface';
import { APIRequester } from 'libs/models/api-requester.model';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';

export class FulfillRequester extends TURequester<IFulfillGraphQLResponse> implements APIRequester {
  constructor(requestKey: APIRequestKeys, payload: IFulfillGraphQLResponse) {
    super(requestKey, payload);
  }
}
