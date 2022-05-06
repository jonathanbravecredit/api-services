import { IStandardResponse } from 'libs/interfaces';

export interface ICancelEnrollmentPayload {
  id: string;
}

export interface ICancelEnrollmentSchema extends ICancelEnrollmentPayload {}

export interface ICancelEnrollGraphQLResponse {
  data: {
    getAppData: {
      id?: string;
      agencies?: {
        transunion?: {
          enrollmentKey: string;
          disputeEnrollmentKey?: string;
        };
      };
    };
  };
}

export interface ICancelEnrollRequest {
  RequestKey: string;
  AdditionalInputs?: {
    Data: {
      Name: string;
      Value: string;
    };
  };
  ClientKey: string;
  EnrollmentKey: string;
}

export interface ICancelEnroll {
  request: ICancelEnrollMsg;
}

export interface ICancelEnrollMsg extends ICancelEnrollRequest {
  AccountCode: string;
  AccountName: string;
  EnrollmentKey: string;
  Language?: string;
}

export interface ICancelEnrollResponse {
  Envelope: {
    Body: {
      CancelEnrollmentResponse: {
        CancelEnrollmentResult: ICancelEnrollResult;
      };
    };
  };
}

export interface ICancelEnrollResult extends IStandardResponse {
  CancelEnrollmentServiceProducts: {
    CancelEnrollmentProduct: ICancelEnrollmentProduct[];
  };
  Success: boolean;
}

export interface ICancelEnrollmentProduct {
  Message: string;
  ServiceProduct: string;
  Status: string;
}
