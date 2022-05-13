import { IVerifyAuthenticationQuestionsResponse } from 'libs/transunion/authentication-questions-verify/verify-authentication-questions.interface';
import { TUResponder } from 'libs/transunion/tu/tu-responder';

export class VerifyAuthenticationQuestionsResponder extends TUResponder<IVerifyAuthenticationQuestionsResponse, any> {
  constructor() {
    super();
  }
}
