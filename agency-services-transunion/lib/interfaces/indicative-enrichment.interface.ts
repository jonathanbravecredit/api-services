export interface IEnrichedIndicativeEnrichment {
  'con:request': {
    'data:AccountCode': string;
    'data:AccountName': string;
    'data:RequestKey': string;
    'data:ClientKey': string;
    'data:Customer': {
      'data:CurrentAddress': {
        'data:AddressLine1': string;
        'data:AddressLine2'?: string;
        'data:City': string;
        'data:State': string;
        'data:Zipcode': string;
      };
      'data:PreviousAddress': {
        'data:AddressLine1': string;
        'data:AddressLine2'?: string;
        'data:City': string;
        'data:State': string;
        'data:Zipcode': string;
      };
      'data:DateOfBirth': string;
      'data:FullName': {
        'data:FirstName': string;
        'data:LastName': string;
      };
      'data:Ssn': string;
    };
    'data:ServiceBundleCode': string;
  };
}

export interface IIndicativeEnrichmentMsg {
  service: string;
  command: string;
  action: string;
  message: {
    'data:ClientKey': string;
    'data:Customer': {
      'data:CurrentAddress': {
        'data:AddressLine1': string;
        'data:AddressLine2'?: string;
        'data:City': string;
        'data:State': string;
        'data:Zipcode': string;
      };
      'data:PreviousAddress': {
        'data:AddressLine1': string;
        'data:AddressLine2'?: string;
        'data:City': string;
        'data:State': string;
        'data:Zipcode': string;
      };
      'data:DateOfBirth': string;
      'data:FullName': {
        'data:FirstName': string;
        'data:LastName': string;
      };
      'data:Ssn': string;
    };
    'data:ServiceBundleCode': string;
  };
}
