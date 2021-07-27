import { IStandardResponse } from 'lib/interfaces';

export interface IGetDisputeStatusGraphQLResponse {
  data: {
    getAppData: {
      id?: string;
      agencies?: {
        transunion?: {
          disputeEnrollmentKey?: string;
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

export interface IGetDisputeStatusPayload {
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
  EnrollmentKey: string;
}

export interface IGetDisputeStatus {
  request: IGetDisputeStatusMsg;
}

export interface IGetDisputeStatusMsg {
  AccountCode: string;
  AccountName: string;
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
  DisputeId?: string;
  EnrollmentKey: string;
}

export interface IGetDsputeStatusResponseSuccess {
  GetDisputeStatus: IGetDisputeStatusResponse;
}

export interface IGetDisputeStatusResponse {
  Envelope: {
    Body: {
      GetDisputeStatusResponse: {
        GetDisputeStatusResult: IGetDisputeStatusResult;
      };
    };
  };
}

export interface IGetDisputeStatusResult extends IStandardResponse {
  DisputeStatus: string;
}