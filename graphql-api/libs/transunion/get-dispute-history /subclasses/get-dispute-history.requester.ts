import { ACCOUNT_CODE, ACCOUNT_NAME } from 'libs/data/constants';
import { APIRequester } from 'libs/models/api-requester.model';
import { IGetDisputeHistoryGraphQLResponse } from 'libs/transunion/get-dispute-history /get-dispute-history.interface';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { v4 } from 'uuid';

export class GetDisputeHistoryRequester extends TURequester<IGetDisputeHistoryGraphQLResponse> implements APIRequester {
  constructor(requestKey: APIRequestKeys, payload: IGetDisputeHistoryGraphQLResponse) {
    super(requestKey, payload);
  }

  getReqWrapper(body: any): any {
    return {
      AccountCode: ACCOUNT_CODE,
      AccountName: ACCOUNT_NAME,
      RequestKey: `BC-${v4()}`,
      ...body,
    };
  }
}
