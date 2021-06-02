export interface IEnrichedIndicativeEnrichment {
  request: {
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
      PreviousAddress: {
        AddressLine1: string;
        AddressLine2?: string;
        City: string;
        State: string;
        Zipcode: string;
      };
      DateOfBirth: string;
      FullName: {
        FirstName: string;
        LastName: string;
      };
      Ssn: string;
    };
    ServiceBundleCode: string;
  };
}

export interface IIndicativeEnrichmentMsg {
  service: string;
  command: string;
  action: string;
  message: {
    ClientKey: string;
    Customer: {
      CurrentAddress: {
        AddressLine1: string;
        AddressLine2?: string;
        City: string;
        State: string;
        Zipcode: string;
      };
      PreviousAddress: {
        AddressLine1: string;
        AddressLine2?: string;
        City: string;
        State: string;
        Zipcode: string;
      };
      DateOfBirth: string;
      FullName: {
        FirstName: string;
        LastName: string;
      };
      Ssn: string;
    };
    ServiceBundleCode: string;
  };
}
