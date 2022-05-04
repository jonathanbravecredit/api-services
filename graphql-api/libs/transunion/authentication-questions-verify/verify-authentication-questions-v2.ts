import { Nested as _nest } from 'libs/utils/helpers/Nested';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { IProxyRequest } from 'libs/interfaces';
import { APIRequest } from 'libs/models/api-request.model';
import {
  IVerifyAuthenticationQuestionsPayload,
  IVerifyAuthenticationQuestionsResponse,
  IVerifyAuthenticationQuestionsResult,
} from 'libs/transunion/authentication-questions-verify/verify-authentication-questions.interface';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { VerifyAuthenticationQuestionsRequester } from 'libs/transunion/authentication-questions-verify/subclasses/verify-authentication-questions.requester';
import { VerifyAuthenticationQuestionsResponder } from 'libs/transunion/authentication-questions-verify/subclasses/verify-authentication-questions.responder';
import { TUAPIProcessor } from 'libs/transunion/tu/tu-api';

export class VerifyAuthenticationQuestionsV2
  extends TUAPIProcessor<
    IVerifyAuthenticationQuestionsPayload,
    IVerifyAuthenticationQuestionsResponse,
    IVerifyAuthenticationQuestionsResult
  >
  implements APIRequest
{
  public payloader = new Payloader<IVerifyAuthenticationQuestionsPayload>();
  public action = 'VerifyAuthenticationQuestions';
  public schema = 'verifyAuthenticationQuestionsRequest';
  public resultKey = 'VerifyAuthenticationQuestionsResult';
  public serviceBundleCode = '';

  constructor(protected payload: IProxyRequest) {
    super('VerifyAuthenticationQuestions', payload, VerifyAuthenticationQuestionsResponder);
  }

  /**
   * Requester runner to:
   * run the indicative enrichment request which:
   *    - accepts the payload
   *    - generates the request object
   *    - generates the request xml
   */
  runRequester(): void {
    const requester = new VerifyAuthenticationQuestionsRequester(
      APIRequestKeys.VERIFY_AUTHENTICATION_QUESTIONS,
      this.prepped,
    );
    this.reqXML = requester.createRequest();
    console.log('reqXML: ', this.reqXML);
  }
}