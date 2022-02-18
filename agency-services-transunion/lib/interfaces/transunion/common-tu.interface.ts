import { IErrorResponse } from 'lib/interfaces';

export interface IStandardResponse {
  AccountName: string;
  ErrorResponse: IErrorResponse;
  RequestKey: string;
  ResponseType: string;
  ClientKey: string;
}
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
export interface IAttributes {
  name?: IName;
  address?: IAddress;
  phone?: IPhone;
  dob?: IDob;
  ssn?: ISsn;
}

export interface IName {
  first?: string;
  middle?: string;
  last?: string;
}

export interface IAddress {
  addressOne?: string;
  addressTwo?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface IPhone {
  primary: string;
}

export interface IDob {
  year?: string;
  month?: string;
  day?: string;
}

export interface ISsn {
  lastfour?: string;
  full?: string;
}
