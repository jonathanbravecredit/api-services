import { ACCOUNT_CODE, ACCOUNT_NAME } from 'libs/data/constants';
import { APIRequester } from 'libs/models/api-requester.model';
import { IGetAuthenticationQuestionsSchema } from 'libs/transunion/authentication-questions/get-authentication-questions.interface';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { v4 } from 'uuid';

export class GetAuthenticationQuestionsRequester
  extends TURequester<IGetAuthenticationQuestionsSchema>
  implements APIRequester
{
  constructor(requestKey: APIRequestKeys, payload: IGetAuthenticationQuestionsSchema) {
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
