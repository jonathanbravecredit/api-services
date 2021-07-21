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
