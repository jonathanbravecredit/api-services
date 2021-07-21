export interface IGetInvestigationResultsRequest {
  id: string;
  disputeId: string;
}

export interface IGetInvestigationResultsGraphQLResponse {
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

export interface IGetInvestigationResultsPayload {
  RequestKey: string;
  ClientKey: string;
  EnrollmentKey: string;
  DisputeId?: string;
}

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
