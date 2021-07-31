export interface IErrorResult {
  AccountName: string;
  ErrorResponse: IErrorResponse;
  RequestKey: string;
  ClientKey: string;
  EnrollmentKey?: string;
  ServiceBundleFulfillmentKey?: string;
}

export interface IErrorResponse {
  Code: number | string;
  Name: string;
  Message: string;
}

export interface IErrorCodes {
  [key: string]: IErrorCode;
}

export interface IErrorCode {
  code: string;
  name: string;
  message: string;
  category: string;
  method: string;
  action: string;
}

export interface INil {
  nil: true;
}
