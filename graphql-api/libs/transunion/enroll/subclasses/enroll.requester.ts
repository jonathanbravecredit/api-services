import { IEnrollGraphQLResponse } from 'libs/transunion/enroll/enroll.interface';
import { APIRequester } from 'libs/models/api-requester.model';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';

export class EnrollRequester extends TURequester<IEnrollGraphQLResponse> implements APIRequester {
  constructor(requestKey: APIRequestKeys, payload: IEnrollGraphQLResponse) {
    super(requestKey, payload);
  }
}
