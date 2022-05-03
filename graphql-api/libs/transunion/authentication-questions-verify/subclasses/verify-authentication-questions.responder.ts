import * as fastXml from 'fast-xml-parser';
import { Nested as _nest } from 'libs/utils/helpers/Nested';
import { TUResponseBase } from 'libs/transunion/tu/TUResponseBase';
import { IVerifyAuthenticationQuestionsResponse } from 'libs/transunion/authentication-questions-verify/verify-authentication-questions.interface';

export class VerifyAuthenticationQuestionsResponder extends TUResponseBase<
  IVerifyAuthenticationQuestionsResponse,
  any
> {
  constructor() {
    super();
  }

  parseResponse(options: any): IVerifyAuthenticationQuestionsResponse {
    if (!this.xml) throw 'No XML set';
    const obj: IVerifyAuthenticationQuestionsResponse = fastXml.parse(this.xml, options);
    this.response = obj;
    this.responseType = _nest.find(this.response, 'ResponseType');
    this.responseError = _nest.find(this.response, 'ErrorResponse');
    return this.response;
  }

  enrichData(data: any | undefined): null {
    this.enriched = null;
    return this.enriched;
  }
}
