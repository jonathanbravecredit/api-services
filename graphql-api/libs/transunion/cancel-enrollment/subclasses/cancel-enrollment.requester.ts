import { APIRequester } from 'libs/models/api-requester.model';
import { ICancelEnrollGraphQLResponse } from 'libs/transunion/cancel-enrollment/cancel-enrollment.interface';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';

export class CancelEnrollmentRequester extends TURequester<ICancelEnrollGraphQLResponse> implements APIRequester {
  constructor(requestKey: APIRequestKeys, payload: ICancelEnrollGraphQLResponse) {
    super(requestKey, payload);
  }
}
