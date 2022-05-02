import { APIRequester } from 'lib/models/api-requester.model';
import { IGetAuthenticationQuestionsPayload } from 'lib/transunion/authentication-questions/get-authentication-questions.interface';
import { TURequester } from 'lib/transunion/tu/tu-requester';
import { APIRequestKeys } from 'lib/utils/requests/requests';

export class GetAuthenticationQuestionsRequester
  extends TURequester<IGetAuthenticationQuestionsPayload>
  implements APIRequester
{
  constructor(requestKey: APIRequestKeys, payload: IGetAuthenticationQuestionsPayload, serviceBundleCode: string) {
    super(requestKey, payload, serviceBundleCode);
  }
}
