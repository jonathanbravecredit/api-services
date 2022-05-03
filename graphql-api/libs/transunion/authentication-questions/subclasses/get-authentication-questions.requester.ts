import { APIRequester } from 'libs/models/api-requester.model';
import { IGetAuthenticationQuestionsPayload } from 'libs/transunion/authentication-questions/get-authentication-questions.interface';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';

export class GetAuthenticationQuestionsRequester
  extends TURequester<IGetAuthenticationQuestionsPayload>
  implements APIRequester
{
  constructor(requestKey: APIRequestKeys, payload: IGetAuthenticationQuestionsPayload, serviceBundleCode: string) {
    super(requestKey, payload, serviceBundleCode);
  }
}
