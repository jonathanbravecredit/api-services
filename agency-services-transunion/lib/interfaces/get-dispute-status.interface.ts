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
  GetDisputeStatus: {
    Envelope: {
      Body: {
        GetDisputeStatusResponse: {
          GetDisputeStatusResult: {
            AccountName: string;
            ErrorResponse: string;
            RequestKey: string;
            ResponseType: string;
            ClientKey: string;
            DisputeStatus: string;
          };
        };
      };
    };
  };
}
// TODO updated the response with the actual
export interface IGetDisputeStatusResponse {
  GetDisputeStatusResult: any;
}

export interface IGetDisputeStatusResult {
  AccountName: string;
  ErrorResponse: string;
  RequestKey: string;
  ResponseType: string;
  ClientKey: string;
  DisputeStatus: string;
}
