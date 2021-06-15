export interface IEnroll {
  request: {
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
    Email?: string;
    Language?: string;
    ServiceBundleCode: string;
    TrustSessionId?: string;
  };
}

export interface IEnrollMsg {
  AccountCode?: string;
  AccountName?: string;
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
  Email?: string;
  Language?: string;
  ServiceBundleCode: string;
  TrustSessionId?: string;
}

export interface IEnrollResponse {
  EnrollResult: IEnrollResult;
}

export interface IEnrollResult {
  'a:AccountName': string;
  'a:ErrorResponse': string;
  'a:RequestKey': string;
  'a:ResponseType': string;
  'a:ClientKey': string;
  'a:EnrollmentKey': string;
  'a:ServiceBundleFulfillmentKey': string;
  'a:ServiceProductFulfillments': {
    'a:ServiceProductResponse': IEnrollServiceProductResponse[] | IEnrollServiceProductResponse;
  };
}

export interface IEnrollServiceProductResponse {
  'a:Bureau': string;
  'a:ErrorResponse': string;
  'a:ServiceBundleResponse': {
    'a:ServiceBundleCode': string;
    'a:ServiceBundleFulfillmentKey': string;
    'a:ServiceBundleFulfillmentStatus': string;
  };
  'a:ServiceProduct': string;
  'a:ServiceProductFulfillmentKey': string;
  'a:ServiceProductObject': string;
  'a:ServiceProductTypeId': string;
  'a:ServiceProductValue': string;
  'a:Status': string;
}
