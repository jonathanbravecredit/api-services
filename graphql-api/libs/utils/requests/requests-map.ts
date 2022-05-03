export const MockRequestMap = {
  ClientKey: 'root.id',
  'Customer.CurrentAddress.AddressLine1': 'root.address.addressOne',
  'Customer.CurrentAddress.AddressLine2': 'root.address.addressTwo',
  'Customer.CurrentAddress.City': 'root.address.city',
  'Customer.CurrentAddress.State': 'root.address.state',
  'Customer.CurrentAddress.Zipcode': 'root.address.zip',
  'Customer.PreviousAddress': 'root.previousAddress',
  'Customer.FullName.FirstName': 'root.name.first',
  'Customer.FullName.LastName': 'root.name.last',
  'Customer.FullName.MiddleName': 'root.name.middle',
  'Customer.Ssn': 'root.ssn.lastfour',
  ServiceBundleCode: 'root.serviceBundleCode',
};

export const IndicativeEnrichmentRequestMap = {
  ClientKey: 'root.id',
  'Customer.CurrentAddress.AddressLine1': 'root.address.addressOne',
  'Customer.CurrentAddress.AddressLine2': 'root.address.addressTwo',
  'Customer.CurrentAddress.City': 'root.address.city',
  'Customer.CurrentAddress.State': 'root.address.state',
  'Customer.CurrentAddress.Zipcode': 'root.address.zip',
  'Customer.PreviousAddress': 'root.previousAddress',
  'Customer.DateOfBirth': 'root.dobformatted',
  'Customer.FullName.FirstName': 'root.name.first',
  'Customer.FullName.LastName': 'root.name.last',
  'Customer.FullName.MiddleName': 'root.name.middle',
  'Customer.Ssn': 'root.ssn.lastfour',
  ServiceBundleCode: 'root.serviceBundleCode',
};

export const GetAuthenticationQuestionsRequestMap = {
  ClientKey: 'root.id',
  'Customer.CurrentAddress.AddressLine1': 'root.address.addressOne',
  'Customer.CurrentAddress.AddressLine2': 'root.address.addressTwo',
  'Customer.CurrentAddress.City': 'root.address.city',
  'Customer.CurrentAddress.State': 'root.address.state',
  'Customer.CurrentAddress.Zipcode': 'root.address.zip',
  'Customer.PreviousAddress': 'root.previousAddress',
  'Customer.DateOfBirth': 'root.dob',
  'Customer.FullName.FirstName': 'root.name.first',
  'Customer.FullName.LastName': 'root.name.last',
  'Customer.FullName.MiddleName': 'root.name.middle',
  'Customer.PhoneNumber': 'root.phone.primary',
  'Customer.Ssn': 'root.ssn.lastfour',
  ServiceBundleCode: 'root.serviceBundleCode',
};

export const VerifyAuthenticationQuestionsRequestMap = {
  ClientKey: 'root.id',
  Answers: 'root.answers',
  ServiceBundleFulfillmentKey: 'root.key',
};
