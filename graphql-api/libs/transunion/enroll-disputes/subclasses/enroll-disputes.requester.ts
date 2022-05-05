import { IEnrollGraphQLResponse } from 'libs/interfaces';
import { EnrollRequester } from 'libs/transunion/enroll/subclasses/enroll.requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';

export class EnrollDisputesRequester extends EnrollRequester {
  constructor(requestKey: APIRequestKeys, payload: IEnrollGraphQLResponse) {
    super(requestKey, payload);
  }
}
