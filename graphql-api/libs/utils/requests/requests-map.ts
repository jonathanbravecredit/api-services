export const BaseGQLRequestMap = {
  ClientKey: 'root.data.getAppData.id',
  'Customer.CurrentAddress.AddressLine1': 'root.data.getAppData.user.userAttributes.address.addressOne',
  'Customer.CurrentAddress.AddressLine2': 'root.data.getAppData.user.userAttributes.address.addressTwo',
  'Customer.CurrentAddress.City': 'root.data.getAppData.user.userAttributes.address.city',
  'Customer.CurrentAddress.State': 'root.data.getAppData.user.userAttributes.address.state',
  'Customer.CurrentAddress.Zipcode': 'root.data.getAppData.user.userAttributes.address.zip',
  'Customer.PreviousAddress': 'root.data.getAppData.user.userAttributes.previousAddress',
  'Customer.FullName.FirstName': 'root.data.getAppData.user.userAttributes.name.first',
  'Customer.FullName.LastName': 'root.data.getAppData.user.userAttributes.name.last',
  'Customer.FullName.MiddleName': 'root.data.getAppData.user.userAttributes.name.middle',
  'Customer.Ssn': 'root.data.getAppData.user.userAttributes.ssn.full',
};

export const BaseRequestMap = {
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

export const MockRequestMap = {
  ...BaseRequestMap,
};

export const IndicativeEnrichmentRequestMap = {
  ...BaseRequestMap,
  'Customer.DateOfBirth': 'root.dobformatted',
};

export const GetAuthenticationQuestionsRequestMap = {
  ...IndicativeEnrichmentRequestMap,
  'Customer.Ssn': 'root.ssn.full',
  'Customer.PhoneNumber': 'root.phone.primary',
};

export const VerifyAuthenticationQuestionsRequestMap = {
  ClientKey: 'root.id',
  Answers: 'root.answers',
  ServiceBundleFulfillmentKey: 'root.key',
};

export const EnrollRequestMap = {
  ...BaseGQLRequestMap,
  'Customer.DateOfBirth': 'root.dobformatted',
  ServiceBundleCode: 'root.serviceBundleCode',
};

export const FulfillRequestMap = {
  ...EnrollRequestMap,
  EnrollmentKey: 'root.data.getAppData.enrollmentKey',
};
