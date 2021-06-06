export interface IEnrichedIndicativeEnrichment {
  request: {
    AccountCode: string;
    AccountName: string;
    AdditionalInputs: {
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
  AdditionalInputs: {
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
    PreviousAddress: {
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
      MiddleName: string;
      Prefix?: string;
      Suffix?: string;
    };
    Ssn: string;
  };
  ServiceBundleCode: string;
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

export interface IIndicativeEnrichmentRequest {
  'soapenv:Envelope': {
    _attributes: {
      'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/';
      'xmlns:con': 'https://consumerconnectws.tui.transunion.com/';
      'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data';
    };
    'soapenv:Header': {};
    'soapenv:Body': {
      'con:IndicativeEnrichment': {
        'con:request': {
          'data:AccountCode': {
            _text: string;
          };
          'data:AccountName': {
            _text: string;
          };
          'data:AdditionalInputs': {
            'data:Data': {
              'data:Name': {
                _text: string;
              };
              'data:Value': {
                _text: string;
              };
            };
          };
          'data:RequestKey': {
            _text: string;
          };
          'data:ClientKey': {
            _text: string;
          };
          'data:Customer': {
            'data:CurrentAddress': {
              'data:AddressLine1': {
                _text: string;
              };
              'data:AddressLine2': {
                _attributes?: {
                  'xsi:nil': 'true';
                  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance';
                };
                _text?: string;
              };
              'data:City': {
                _text: string;
              };
              'data:State': {
                _text: string;
              };
              'data:Zipcode': {
                _text: string;
              };
            };
            'data:DateOfBirth': {
              _text: string;
            };
            'data:FullName': {
              'data:FirstName': {
                _text: string;
              };
              'data:LastName': {
                _text: string;
              };
              'data:MiddleName': {
                _text: string;
              };
              'data:Prefix': {
                _attributes?: {
                  'xsi:nil': 'true';
                  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance';
                };
                _text?: string;
              };
              'data:Suffix': {
                _attributes?: {
                  'xsi:nil': 'true';
                  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance';
                };
              };
            };
            'data:PreviousAddress': {
              'data:AddressLine1': {
                _attributes?: {
                  'xsi:nil': 'true';
                  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance';
                };
                _text?: string;
              };
              'data:AddressLine2': {
                _attributes?: {
                  'xsi:nil': 'true';
                  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance';
                };
                _text?: string;
              };
              'data:City': {
                _attributes?: {
                  'xsi:nil': 'true';
                  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance';
                };
                _text?: string;
              };
              'data:State': {
                _attributes?: {
                  'xsi:nil': 'true';
                  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance';
                };
                _text?: string;
              };
              'data:Zipcode': {
                _attributes?: {
                  'xsi:nil': 'true';
                  'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance';
                };
                _text?: string;
              };
            };
            'data:Ssn': {
              _text: string;
            };
          };
          'data:ServiceBundleCode': {
            _text: string;
          };
        };
      };
    };
  };
}
