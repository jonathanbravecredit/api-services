import { IDob, IErrorResponse, INil, IStandardResponse } from 'libs/interfaces/transunion';

export interface IFulfillGraphQLResponse {
  data: {
    getAppData: IGetDataForFulfill;
  };
  dobformatted?: string;
  serviceBundleCode?: string;
}

export interface IGetDataForFulfill {
  id?: string;
  agencies?: {
    transunion?: {
      enrollmentKey: string;
      disputeEnrollmentKey?: string;
      serviceBundleFulfillmentKey?: string;
      disputeServiceBundleFulfillmentKey?: string;
    };
  };
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
}

export interface IFulfillPayload {
  id: string;
}
export interface IFulfillSchema extends IFulfillPayload {
  serviceBundleCode: string;
}

export interface IFulfill {
  request: IFulfillMsg;
}
export interface IFulfillRequest extends IFulfillMsg {}
export interface IFulfillMsg {
  AccountCode: string;
  AccountName: string;
  EnrollmentKey: string;
  Language?: string;
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
    PreviousAddress?: {
      AddressLine1?: string;
      AddressLine2?: string;
      City?: string;
      State?: string;
      Zipcode?: string;
    };
    DateOfBirth: string;
    FullName: {
      FirstName: string;
      LastName: string;
      MiddleName?: string;
      Prefix?: string;
      Suffix?: string;
    };
    PhoneNumber?: string;
    Ssn: string;
  };
  ServiceBundleCode: string;
}

export interface IFulfillResponse {
  Envelope: {
    Body: {
      FulfillResponse: {
        FulfillResult: IFulfillResult;
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

export interface IFulfillServiceProductResponse {
  Bureau: string;
  ErrorResponse: string;
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

export interface IFulfillVantageScore {
  CreditScoreType: {
    riskScore: number;
  };
}

export interface IFulfillUserAttributes {
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
  dob?: IDob;
  ssn?: {
    lastfour?: string;
    full?: string;
  };
}

export interface IFulfillProxyResult {
  success: boolean;
  error?: IErrorResponse | INil | string;
  data?: IFulfillResult;
}
