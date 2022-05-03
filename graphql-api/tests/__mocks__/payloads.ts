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
  ServiceBundleCode: undefined,
};

export const MOCK_UNFLATTENED_MAP = {
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
    FullName: {
      FirstName: 'First',
      LastName: 'Last',
      MiddleName: 'Middle',
    },
    Ssn: '1234',
  },
  ServiceBundleCode: undefined,
};
