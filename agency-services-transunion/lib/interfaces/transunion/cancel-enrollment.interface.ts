import { IStandardResponse, IFulfillServiceProductResponse } from 'lib/interfaces';

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

export interface ICancelEnrollPayload {
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

export interface ICancelEnrollMsg extends ICancelEnrollPayload {
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

export interface IFulfillResult extends IStandardResponse {
  EnrollmentKey: string;
  ServiceBundleFulfillmentKey: string;
  ServiceProductFulfillments: {
    ServiceProductResponse: IFulfillServiceProductResponse[] | IFulfillServiceProductResponse;
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
