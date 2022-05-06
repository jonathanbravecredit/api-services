import { IProcessDisputeTradelineResult } from 'libs/interfaces';
import { IStandardResponse } from 'libs/interfaces/transunion/common-tu.interface';

export interface IStartDisputeGraphQLResponse {
  data: {
    getAppData: {
      id?: string;
      agencies?: {
        transunion?: {
          disputeEnrollmentKey: string;
          disputeServiceBundleFulfillmentKey?: string;
          serviceBundleFulfillmentKey?: string;
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

export interface IDisputeUserAttributes {
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
}

export interface IStartDisputeRequest {
  disputes: IProcessDisputeTradelineResult[];
}

export interface IStartDisputePayload extends IStartDisputeRequest {
  id: string;
}
export interface IStartDispute {
  request: IStartDisputeMsg;
}

export interface IStartDisputeMsg {
  AccountCode: string;
  AccountName: string;
  RequestKey: string;
  ClientKey: string;
  Attachment?: IAttachment | IAttachment[];
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
  Employers?: IEmployers | IEmployers[];
  EnrollmentKey?: string;
  IndicativeDisputes?: IIndicativeDisputes;
  LineItems?: ILineItem | ILineItem[];
  ServiceBundleFulfillmentKey?: string;
  ServiceProductFulfillmentKey?: string;
}

export interface IStartDisputeResponse {
  Envelope: {
    Body: {
      StartDisputeResponse: {
        StartDisputeResult: IStartDisputeResult;
      };
    };
  };
}

// I need to bundle our dispute package with the dispute resp from TU
export interface IStartDisputeBundle {
  startDisputeResult: IStartDisputeResult;
  disputes: IProcessDisputeTradelineResult[];
}

export interface IStartDisputeResult extends IStandardResponse {
  DisputeStatus: IDisputeStatus;
}

export interface IDisputeStatus {
  DisputeStatusDetail: IDisputeStatusDetail;
}

export interface IDisputeStatusDetail {
  DisputeId: string | number;
  LetterStatus?: ILetterStatus;
  OpenDisputes?: IDisputesStatus;
  ClosedDisputes?: IDisputesStatus;
  Status: string;
}

export interface ILetterStatus {
  DisputeLetterCode: string;
  DisputeLetterContent: string;
}

export interface IDisputesStatus {
  EstimatedCompletionDate?: string;
  LastUpdatedDate?: string;
  OpenDate?: string;
  RequestedDate?: string;
  TotalClosedDisputedItems?: string;
  TotalDisputedItems?: string;
  TotalOpenDisputedItems?: string;
  TotalPVDisputedItemCount?: string;
}

export interface IAttachment {
  Attachment: {
    FileName: string;
    FilteType: string;
  };
}
export interface IEmployers {
  Employer: {
    City?: string;
    Delete?: string;
    Directional?: string;
    EndDate?: string;
    HouseNumber?: string;
    Name?: string;
    Number?: string;
    Occupation?: string;
    StartDate?: string;
    State?: string;
    StreetName?: string;
    ThoroughFare?: string;
    ZipCode?: string;
    ZipCodeExt?: string;
  };
}
export interface IIndicativeDisputes {
  Aka?: IAka | IAka[];
  Address?: IIndicativeDisputesAddress;
  DeleteAddress?: string;
  PreviousAddress?: IIndicativeDisputesAddress;
  DeletePreviousAddress?: string;
}

export interface IIndicativeDisputesAddress {
  AddressLine1?: string;
  AddressLine2?: string;
  City?: string;
  State?: string;
  Zipcode?: string;
}

export interface IAka {
  ValueData: {
    Delete?: string;
    Value?: string;
  };
}

export interface ILineItem {
  LineItem: {
    ClaimCodes: IClaimCode | IClaimCode[];
    CreditReportItem: string;
    LineItemComment?: string;
    LineItemCommentType?: string;
    UploadDocumentId?: string;
  };
}

export interface IClaimCode {
  ClaimCode: {
    Code: string;
  };
}
