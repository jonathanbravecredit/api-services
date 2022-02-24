import { IErrorResponse, INil, IStandardResponse } from 'lib/interfaces/transunion';

export interface IFulfillGraphQLResponse {
  data: {
    getAppData: IGetDataForFulfill;
  };
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
  EnrollmentKey: string;
  ServiceBundleCode: string;
}

export interface IFulfill {
  request: IFulfillMsg;
}

export interface IFulfillRequest extends IFulfillMsg {}
export interface IFulfillMsg extends IFulfillPayload {
  AccountCode: string;
  AccountName: string;
  EnrollmentKey: string;
  Language?: string;
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

export interface IName {
  first?: string;
  middle?: string;
  last?: string;
}

export interface IAddress {
  addressOne?: string;
  addressTwo?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface IPhone {
  primary: string;
}

export interface IDob {
  year?: string;
  month?: string;
  day?: string;
}

export interface ISsn {
  lastfour?: string;
  full?: string;
}

export interface IFulfillProxyResult {
  success: boolean;
  error?: IErrorResponse | INil | string;
  data?: IFulfillResult;
}
