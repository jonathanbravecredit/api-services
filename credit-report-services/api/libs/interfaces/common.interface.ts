export interface ICodeRef {
  abbreviation?: string;
  description?: string;
  symbol?: number | string;
  rank?: number | string;
}

export interface ISource {
  BorrowerKey?: string;
  Bureau?: ICodeRef;
  InquiryDate?: string;
  Reference?: string;
}

export interface IRemark {
  RemarkCode?: ICodeRef;
  customRemark?: string;
}

export interface IPartitionSet {
  partitionSet?: number | string;
}
export interface IPartitionElements extends IPartitionSet {
  dateReported?: string;
  dateUpdated?: string;
}

export interface ITUServiceResponse<T> {
  success: boolean;
  error?: IErrorResponse;
  data?: T;
}

export interface ITUUnparsed {
  unparsed: string;
}

export interface ITUText {
  type?: number | string;
  text?: string;
}

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
  Name?: string;
  Message?: string;
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
