import { IErrorResponse, INil } from 'lib/interfaces/errors.interface';

export interface IFulfillGraphQLResponse {
  data: {
    getAppData: {
      id?: string;
      agencies?: {
        transunion?: {
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
    };
  };
}

export interface IFulfillPayload {
  RequestKey: string;
  AdditionalInputs: {
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
    };
    Ssn: string;
  };
  ServiceBundleCode: string;
}

export interface IFulfill {
  request: IFulfillMsg;
}

export interface IFulfillMsg {
  AccountCode: string;
  AccountName: string;
  AdditionalInputs?: {
    Data: {
      Name: string;
      Value: string;
    };
  };
  RequestKey: string;
  ClientKey: string;
  Customer: {
    CurrentAddress: {
      AddressLine1: string;
      AddressLine2?: string;
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
  Language?: string;
  ServiceBundleCode: string;
}

export interface IFulfillResponseSuccess {
  Fulfill: {
    Envelope: {
      Body: {
        FulfillResponse: {
          FulfillResult: {
            AccountName: string;
            ErrorResponse: string;
            RequestKey: string;
            ResponseType: string;
            ClientKey: string;
            EnrollmentKey: string;
            ServiceBundleFulfillmentKey: string;
            ServiceProductFulfillments: {
              ServiceProductResponse: IFulfillServiceProductResponse[] | IFulfillServiceProductResponse;
            };
          };
        };
      };
    };
  };
}

export interface IFulfillResponse {
  FulfillResult: IFulfillResult;
}

export interface IFulfillResult {
  AccountName: string;
  ErrorResponse: string;
  RequestKey: string;
  ResponseType: string;
  ClientKey: string;
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
