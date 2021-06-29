export interface IGetInvestigationResults {
  request: IGetInvestigationResultsMsg;
}

export interface IGetInvestigationResultsMsg {
  AccountCode: string;
  AccountName: string;
  RequestKey: string;
  ClientKey: string;
  DisputeId?: string;
  EnrollmentKey: string;
}
