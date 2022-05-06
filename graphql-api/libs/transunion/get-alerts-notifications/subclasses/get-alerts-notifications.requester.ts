import { ACCOUNT_CODE, ACCOUNT_NAME } from 'libs/data/constants';
import { APIRequester } from 'libs/models/api-requester.model';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { v4 } from 'uuid';

export class GetAlertsNotificationsRequester extends TURequester<any> implements APIRequester {
  constructor(requestKey: APIRequestKeys, payload: any) {
    super(requestKey, payload);
  }

  getReqWrapper(body: any): any {
    return {
      AccountCode: ACCOUNT_CODE,
      AccountName: ACCOUNT_NAME,
      RequestKey: `BC-${v4()}`,
      AdditionalInputs: {
        Data: {
          Name: 'DisputeVersion',
          Value: '2',
        },
      },
      ...body,
    };
  }
}
