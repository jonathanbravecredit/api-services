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

export interface IGetInvestigationResult {
  AccountName: string;
  ErrorResponse: string;
  RequestKey: string;
  ResponseType: string;
  ClientKey: string;
  CreditBureau: string;
  InvestigationResults: string;
}

// plural
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

export interface IGetInvestigationEnrichPayload {
  disputeId: string;
  getInvestigationResult: IGetInvestigationResult;
}
