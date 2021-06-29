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
