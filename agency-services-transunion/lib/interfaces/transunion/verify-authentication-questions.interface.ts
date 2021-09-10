import { IStandardResponse, IVerifyAuthenticationAnswer } from 'lib/interfaces';
import { IErrorResponse } from 'lib/interfaces/transunion/errors.interface';

export interface IVerifyAuthenticationQuestionsRequest {
  answers: IVerifyAuthenticationAnswer[];
  key: string;
}
export interface IVerifyAuthenticationQuestionsPayload extends IVerifyAuthenticationQuestionsRequest {
  id: string;
}
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
    Answers: IVerifyAuthenticationAnswer[];
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
  Answers: IVerifyAuthenticationAnswer[];
  ServiceBundleFulfillmentKey: string;
  TrustSessionId?: string;
}

export interface IVerifyAuthenticationQuestionsResponse {
  Envelope: {
    Body: {
      VerifyAuthenticationQuestionsResponse: {
        VerifyAuthenticationQuestionsResult: IVerifyAuthenticationQuestionsResult;
      };
    };
  };
}

export interface IVerifyAuthenticationQuestionsResult extends IStandardResponse {
  AuthenticationDetails: string;
  AuthenticationStatus: string;
}
