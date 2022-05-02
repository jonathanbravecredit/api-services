import * as fastXml from 'fast-xml-parser';
import { Nested as _nest } from 'lib/utils/helpers/Nested';
import { TUResponseBase } from 'lib/transunion/tu/TUResponseBase';
import { IGetAuthenticationQuestionsResponse } from 'lib/transunion/authentication-questions/get-authentication-questions.interface';

export class GetAuthenticationQuestionsResponder extends TUResponseBase<IGetAuthenticationQuestionsResponse, any> {
  constructor() {
    super();
  }

  parseResponse(options: any): IGetAuthenticationQuestionsResponse {
    if (!this.xml) throw 'No XML set';
    const obj: IGetAuthenticationQuestionsResponse = fastXml.parse(this.xml, options);
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
