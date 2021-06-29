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
// TODO updated the response with the actual
export interface IGetDisputeStatusResponse {
  GetDisputeStatusResult: any;
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
  DeletePreviousAddress?: string;
  PreviousAddress?: {
    AddressLine1?: string;
    AddressLine2?: string;
    City?: string;
    State?: string;
    Zipcode?: string;
  };
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
    LineItemComment: string;
    LineItemCommentType: string;
    UploadDocumentId: string;
  };
}

export interface IClaimCode {
  ClaimCode: {
    Code: string;
  };
}
