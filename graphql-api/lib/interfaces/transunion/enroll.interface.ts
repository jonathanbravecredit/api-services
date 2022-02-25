import { IErrorResponse, INil, IStandardResponse } from 'lib/interfaces';

export interface IEnrollGraphQLResponse {
  data: {
    getAppData: {
      id?: string;
      user?: {
        userAttributes?: {
          name?: {
            first?: string;
            middle?: string;
            last?: string;
          };
          address?: {
            addressOne?: string;
            addressTwo?: string;
            city?: string;
            state?: string;
            zip?: string;
          };
          phone?: {
            primary?: string;
          };
          dob?: {
            year?: string;
            month?: string;
            day?: string;
          };
          ssn?: {
            lastfour?: string;
            full?: string;
          };
        };
      };
    };
  };
}

export interface IEnrollPayload {
  RequestKey: string;
  AdditionalInputs?: {
    Data: {
      Name: string;
      Value: string;
    };
  };
  ClientKey: string;
  Customer: {
    CurrentAddress: {
      AddressLine1: string;
      AddressLine2: string;
      City: string;
      State: string;
      Zipcode: string;
    };
    DateOfBirth: string;
    FullName: {
      FirstName: string;
      LastName: string;
      MiddleName: string;
      Prefix?: string;
      Suffix?: string;
    };
    Ssn: string;
  };
  ServiceBundleCode: string;
}

export interface IEnroll {
  request: IEnrollMsg;
}

export interface IEnrollRequest extends IEnrollMsg {}
export interface IEnrollMsg extends IEnrollPayload {
  AccountCode: string;
  AccountName: string;
  Email?: string;
  Language?: string;
  TrustSessionId?: string;
}

export interface IEnrollResponse {
  Envelope: {
    Body: {
      EnrollResponse: {
        EnrollResult: IEnrollResult;
      };
    };
  };
}

export interface IEnrollResult extends IStandardResponse {
  EnrollmentKey: string;
  ServiceBundleFulfillmentKey: string;
  ServiceProductFulfillments: {
    ServiceProductResponse: IEnrollServiceProductResponse[] | IEnrollServiceProductResponse;
  };
}

export interface IEnrollServiceProductResponse {
  Bureau: string;
  ErrorResponse: IErrorResponse;
  ServiceBundleResponse: {
    ServiceBundleCode: string;
    ServiceBundleFulfillmentKey: string;
    ServiceBundleFulfillmentStatus: string;
  };
  ServiceProduct: string;
  ServiceProductFulfillmentKey: string;
  ServiceProductObject: string;
  ServiceProductTypeId: string;
  ServiceProductValue: string;
  Status: string;
}