import { IVerifyAuthenticationAnswersArray } from 'lib/interfaces/verify-authentication-answers.interface';

export interface IVerifyAuthenticationQuestions {
  request: {
    AccountCode: string;
    AccountName: string;
    AdditionalInputs?: {
      Data: {
        Name: string;
        Value: string;
      };
    };
    RequestKey: string;
    ClientKey: string;
    Answers: IVerifyAuthenticationAnswersArray;
    ServiceBundleFulfillmentKey: string;
    TrustSessionId?: string;
  };
}

export interface IVerifyAuthenticationQuestionsMsg {
  AdditionalInputs?: {
    Data: {
      Name: string;
      Value: string;
    };
  };
  RequestKey: string;
  ClientKey: string;
  Answers: IVerifyAuthenticationAnswersArray;
  ServiceBundleFulfillmentKey: string;
  TrustSessionId?: string;
}

export interface IVerifyAuthenticationQuestionsResponse {
  's:Envelope': {
    _attributes: {
      'xmlns:s': string;
    };
    's:Body': {
      IndicativeEnrichmentResponse: {
        _attributes: {
          xmlns: string;
        };
        IndicativeEnrichmentResult: {
          _attributes: {
            'xmlns:a': string;
            'xmlns:i': string;
          };
          'a:AccountName': {
            _text: string;
          };
          'a:ErrorResponse': {
            _attributes: {
              'i:nil': string;
            };
          };
          'a:RequestKey': {
            _text: string;
          };
          'a:ResponseType': {
            _text: string;
          };
          'a:ClientKey': {
            _text: string;
          };
          'a:Customer': {
            _text: string;
          };
          'a:SSN': {
            _text: string;
          };
        };
      };
    };
  };
}
