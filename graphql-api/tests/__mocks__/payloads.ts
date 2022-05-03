import { ACCOUNT_CODE, ACCOUNT_NAME } from 'libs/data/constants';

export const MOCK_PAYLOAD = {
  id: 'abc',
  address: {
    addressOne: '123 Main Street',
    addressTwo: 'Unit A',
    city: 'Anytown',
    state: 'CA',
    zip: '98765',
  },
  previousAddress: {},
  name: {
    first: 'First',
    middle: 'Middle',
    last: 'Last',
  },
  ssn: {
    lastfour: '1234',
  },
  serviceBundleCode: 'mockCode',
};

export const MOCK_MAPPED = {
  ClientKey: 'abc',
  'Customer.CurrentAddress.AddressLine1': '123 Main Street',
  'Customer.CurrentAddress.AddressLine2': 'Unit A',
  'Customer.CurrentAddress.City': 'Anytown',
  'Customer.CurrentAddress.State': 'CA',
  'Customer.CurrentAddress.Zipcode': '98765',
  'Customer.PreviousAddress': {},
  'Customer.FullName.FirstName': 'First',
  'Customer.FullName.LastName': 'Last',
  'Customer.FullName.MiddleName': 'Middle',
  'Customer.Ssn': '1234',
  ServiceBundleCode: 'mockCode',
};

export const MOCK_UNFLATTENED_OBJ_BODY = {
  ClientKey: 'abc',
  Customer: {
    CurrentAddress: {
      AddressLine1: '123 Main Street',
      AddressLine2: 'Unit A',
      City: 'Anytown',
      State: 'CA',
      Zipcode: '98765',
    },
    PreviousAddress: {},
    FullName: { FirstName: 'First', LastName: 'Last', MiddleName: 'Middle' },
    Ssn: '1234',
  },
  ServiceBundleCode: 'mockCode',
};

export const MOCK_UNFLATTENED_OBJ_ALL = {
  AccountCode: 'M2RVc0ZZM0Rwd2FmZA',
  AccountName: 'CC2BraveCredit',
  AdditionalInputs: { Data: { Name: 'CreditReportVersion', Value: '7.1' } },
  RequestKey: 'BC-request-key',
  ClientKey: 'abc',
  Customer: {
    CurrentAddress: {
      AddressLine1: '123 Main Street',
      AddressLine2: 'Unit A',
      City: 'Anytown',
      State: 'CA',
      Zipcode: '98765',
    },
    PreviousAddress: {},
    FullName: { FirstName: 'First', LastName: 'Last', MiddleName: 'Middle' },
    Ssn: '1234',
  },
  ServiceBundleCode: 'mockCode',
};

export const MOCK_MAPPED_XML = {
  'soapenv:Body.con:Mock.con:request.data:AccountCode': { _text: 'M2RVc0ZZM0Rwd2FmZA' },
  'soapenv:Body.con:Mock.con:request.data:AccountName': { _text: 'CC2BraveCredit' },
  'soapenv:Body.con:Mock.con:request.data:AdditionalInputs.data:Data.data:Name': { _text: 'CreditReportVersion' },
  'soapenv:Body.con:Mock.con:request.data:AdditionalInputs.data:Data.data:Value': { _text: '7.1' },
  'soapenv:Body.con:Mock.con:request.data:RequestKey': { _text: 'BC-request-key' },
  'soapenv:Body.con:Mock.con:request.data:ClientKey': { _text: 'abc' },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:CurrentAddress.data:AddressLine1': { _text: '123 Main Street' },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:CurrentAddress.data:AddressLine2': { _text: 'Unit A' },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:CurrentAddress.data:City': { _text: 'Anytown' },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:CurrentAddress.data:State': { _text: 'CA' },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:CurrentAddress.data:Zipcode': { _text: '98765' },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:DateOfBirth': {
    _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
  },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:FullName.data:FirstName': { _text: 'First' },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:FullName.data:LastName': { _text: 'Last' },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:FullName.data:MiddleName': { _text: 'Middle' },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:FullName.data:Prefix': {
    _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
  },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:FullName.data:Suffix': {
    _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
  },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:PreviousAddress.data:AddressLine1': {
    _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
  },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:PreviousAddress.data:AddressLine2': {
    _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
  },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:PreviousAddress.data:City': {
    _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
  },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:PreviousAddress.data:State': {
    _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
  },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:PreviousAddress.data:Zipcode': {
    _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
  },
  'soapenv:Body.con:Mock.con:request.data:Customer.data:Ssn': { _text: '1234' },
  'soapenv:Body.con:Mock.con:request.data:ServiceBundleCode': { _text: 'mockCode' },
};

export const MOCK_UNFLATTENED_XML_BODY = {
  'soapenv:Body': {
    'con:Mock': {
      'con:request': {
        'data:AccountCode': { _text: 'M2RVc0ZZM0Rwd2FmZA' },
        'data:AccountName': { _text: 'CC2BraveCredit' },
        'data:AdditionalInputs': {
          'data:Data': { 'data:Name': { _text: 'CreditReportVersion' }, 'data:Value': { _text: '7.1' } },
        },
        'data:RequestKey': { _text: 'BC-request-key' },
        'data:ClientKey': { _text: 'abc' },
        'data:Customer': {
          'data:CurrentAddress': {
            'data:AddressLine1': { _text: '123 Main Street' },
            'data:AddressLine2': { _text: 'Unit A' },
            'data:City': { _text: 'Anytown' },
            'data:State': { _text: 'CA' },
            'data:Zipcode': { _text: '98765' },
          },
          'data:DateOfBirth': {
            _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
          },
          'data:FullName': {
            'data:FirstName': { _text: 'First' },
            'data:LastName': { _text: 'Last' },
            'data:MiddleName': { _text: 'Middle' },
            'data:Prefix': {
              _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
            },
            'data:Suffix': {
              _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
            },
          },
          'data:PreviousAddress': {
            'data:AddressLine1': {
              _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
            },
            'data:AddressLine2': {
              _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
            },
            'data:City': {
              _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
            },
            'data:State': {
              _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
            },
            'data:Zipcode': {
              _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
            },
          },
          'data:Ssn': { _text: '1234' },
        },
        'data:ServiceBundleCode': { _text: 'mockCode' },
      },
    },
  },
};

export const MOCK_UNFLATTENED_XML_ALL = {
  'soapenv:Envelope': {
    _attributes: {
      'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
      'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
    },
    'soapenv:Header': {},
    'soapenv:Body': {
      'con:Mock': {
        'con:request': {
          'data:AccountCode': { _text: 'M2RVc0ZZM0Rwd2FmZA' },
          'data:AccountName': { _text: 'CC2BraveCredit' },
          'data:AdditionalInputs': {
            'data:Data': { 'data:Name': { _text: 'CreditReportVersion' }, 'data:Value': { _text: '7.1' } },
          },
          'data:RequestKey': { _text: 'BC-request-key' },
          'data:ClientKey': { _text: 'abc' },
          'data:Customer': {
            'data:CurrentAddress': {
              'data:AddressLine1': { _text: '123 Main Street' },
              'data:AddressLine2': { _text: 'Unit A' },
              'data:City': { _text: 'Anytown' },
              'data:State': { _text: 'CA' },
              'data:Zipcode': { _text: '98765' },
            },
            'data:DateOfBirth': {
              _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
            },
            'data:FullName': {
              'data:FirstName': { _text: 'First' },
              'data:LastName': { _text: 'Last' },
              'data:MiddleName': { _text: 'Middle' },
              'data:Prefix': {
                _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
              },
              'data:Suffix': {
                _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
              },
            },
            'data:PreviousAddress': {
              'data:AddressLine1': {
                _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
              },
              'data:AddressLine2': {
                _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
              },
              'data:City': {
                _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
              },
              'data:State': {
                _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
              },
              'data:Zipcode': {
                _attributes: { 'xsi:nil': 'true', 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance' },
              },
            },
            'data:Ssn': { _text: '1234' },
          },
          'data:ServiceBundleCode': { _text: 'mockCode' },
        },
      },
    },
  },
};

export const REQ_WRAPPER_CONTAINING = {
  AccountCode: ACCOUNT_CODE,
  AccountName: ACCOUNT_NAME,
  AdditionalInputs: {
    Data: {
      Name: 'CreditReportVersion',
      Value: '7.1',
    },
  },
};

export const XML_WRAPPER_CONTAINING = {
  'soapenv:Envelope': {
    _attributes: {
      'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
      'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
    },
    'soapenv:Header': {},
  },
};
