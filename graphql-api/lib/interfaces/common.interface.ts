export interface ICodeRef {
  abbreviation: string | null;
  description: string | null;
  symbol: number | string | null;
  rank: number | string | null;
}

export interface ISourceSummary {
  Source: ISource;
}
export interface ISource {
  BorrowerKey: string | null;
  Bureau: ICodeRef;
  InquiryDate: string | null;
  Reference: string | null;
}

export interface IRemark {
  RemarkCode: ICodeRef;
  customRemark: string | null;
}

export interface IDate {
  month: string | number | null;
  year: string | number | null;
  day: string | number | null;
}

export interface IPartitionSet {
  partitionSet: number | string | null;
}
export interface IPartitionElements extends IPartitionSet {
  dateReported: string | null;
  dateUpdated: string | null;
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
