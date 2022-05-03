import { IStandardResponse } from 'libs/interfaces/transunion/common-tu.interface';

export interface IGetDisputeHistoryGraphQLResponse {
  data: {
    getAppData: {
      id?: string;
      agencies?: {
        transunion?: {
          disputeEnrollmentKey?: string;
        };
      };
    };
  };
}

export interface IGetDisputeHistoryResponse {
  Envelope: {
    Body: {
      GetDisputeHistoryResponse: {
        GetDisputeHistoryResult: IGetDisputeHistoryResult;
      };
    };
  };
}

export interface IGetDisputeHistoryResult extends IStandardResponse {
  Disputes: any;
}

export interface IGetDisputeHistoryPayload {
  RequestKey: string;
  ClientKey: string;
  EnrollmentKey: string;
}

export interface IGetDisputeHistory {
  request: IGetDisputeHistoryMsg;
}

export interface IGetDisputeHistoryMsg {
  AccountCode: string;
  AccountName: string;
  RequestKey: string;
  ClientKey: string;
  EnrollmentKey: string;
}
