import * as dayjs from 'dayjs';
import { Nested as _nest } from 'libs/utils/helpers/Nested';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { IProxyRequest } from 'libs/interfaces';
import { APIRequest } from 'libs/models/api-request.model';
import {
  IGetAuthenticationQuestionsPayload,
  IGetAuthenticationQuestionsResponse,
  IGetAuthenticationQuestionsResult,
} from 'libs/transunion/authentication-questions/get-authentication-questions.interface';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { GetAuthenticationQuestionsRequester } from 'libs/transunion/authentication-questions/subclasses/get-authentication-questions.requester';
import { GetAuthenticationQuestionsResponder } from 'libs/transunion/authentication-questions/subclasses/get-authentication-questions.responder';
import { TUAPIProcessor } from 'libs/transunion/tu/tu-api';

export class GetAuthenticationQuestionsV2
  extends TUAPIProcessor<
    IGetAuthenticationQuestionsPayload,
    IGetAuthenticationQuestionsResponse,
    IGetAuthenticationQuestionsResult
  >
  implements APIRequest
{
  public payloader = new Payloader<IGetAuthenticationQuestionsPayload>();
  public action = 'GetAuthenticationQuestions';
  public schema = 'getAuthenticationQuestionsRequest';
  public resultKey = 'GetAuthenticationQuestionsResult';
  public serviceBundleCode = 'CC2BraveCreditAuthentication';

  constructor(protected payload: IProxyRequest) {
    super('GetAuthenticationQuestions', payload, GetAuthenticationQuestionsResponder);
  }

  /**
   * Payloader runner to:
   *  - validate the payload
   *  - prep the payload
   *  - GetAuthenticationQuestions Needs formatted Dob
   * @returns
   */
  async runPayloader(): Promise<void> {
    await super.runPayloader();
    this.formatDob(); // added step
  }

  /**
   * Requester runner to:
   * run the indicative enrichment request which:
   *    - accepts the payload
   *    - generates the request object
   *    - generates the request xml
   */
  runRequester(): void {
    const requester = new GetAuthenticationQuestionsRequester(
      APIRequestKeys.GET_AUTHENTICATION_QUESTIONS,
      this.prepped,
    );
    this.reqXML = requester.createRequest();
    console.log('reqXML: ', this.reqXML);
  }

  formatDob(): void {
    const { year, month, day } = this.prepped.dob;
    const iso = dayjs(`${year}-${month}-${day}`, 'YYYY-MMM-D');
    this.prepped.dobformatted = iso.format('YYYY-MM-DD');
  }
}
