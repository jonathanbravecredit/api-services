import { IGetAuthenticationQuestionsResponse } from 'libs/transunion/authentication-questions/get-authentication-questions.interface';
import { TUResponder } from 'libs/transunion/tu/tu-responder';

export class GetAuthenticationQuestionsResponder extends TUResponder<IGetAuthenticationQuestionsResponse, any> {
  constructor() {
    super();
  }
}
