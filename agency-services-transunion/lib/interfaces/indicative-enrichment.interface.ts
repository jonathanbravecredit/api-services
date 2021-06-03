export interface IEnrichedIndicativeEnrichment {
  request: {
    AccountCode: string;
    AccountName: string;
    AdditionalInputs: {
      Data: {
        Name: string;
        Value: number | string;
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
        MiddleName?: string;
        Prefix?: string;
        Suffix?: string;
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
    AdditionalInputs: {
      Data: {
        Name: string;
        Value: number | string;
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

export interface IIndicativeEnrichmentResponse {
  's:Envelope': {
    _attributes: {
      'xmlns:s': string;
    };
    's:Body': {
      IndicativeEnrichmentResponse: {
        _attributes: {
          xmlns: string;
        };
        IndicativeEnrichmentResult: {
          _attributes: {
            'xmlns:a': string;
            'xmlns:i': string;
          };
          'a:AccountName': {
            _text: string;
          };
          'a:ErrorResponse': {
            _attributes: {
              'i:nil': string;
            };
          };
          'a:RequestKey': {
            _text: string;
          };
          'a:ResponseType': {
            _text: string;
          };
          'a:ClientKey': {
            _text: string;
          };
          'a:Customer': {
            _text: string;
          };
          'a:SSN': {
            _text: string;
          };
        };
      };
    };
  };
}
