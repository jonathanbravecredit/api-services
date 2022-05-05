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

export const GetServiceProductMap = {
  ClientKey: 'root.id',
  CSRFToken: 'root.csrfToken',
  ClientBrowserType: 'root.clientBrowserType',
  IpAddress: 'root.ipAddress',
  ProductDisplay: 'root.productDisplay',
  SeviceBundleFulfillmentKey: 'root.serviceBundleFulfillmentKey',
};

export const GetDisputeStatusMap = {
  ...BaseGQLRequestMap,
  'Customer.DateOfBirth': 'root.dobformatted',
  'Customer.PhoneNumber': 'root.data.getAppData.user.userAttributes.phone.primary',
  'Customer.Ssn': 'root.data.getAppData.user.userAttributes.ssn.full',
  EnrollmentKey: 'root.data.getAppData.agencies.transunion.disputeEnrollmentKey',
  DisputeId: 'root.disputeId',
};

export const GetDisputeHistoryMap = {
  EnrollmentKey: 'root.data.getAppData.agencies.transunion.disputeEnrollmentKey',
};

export const GetTrendingDataMap = {
  ClientKey: 'root.id',
  FromDate: 'root.fromDate',
  ToDate: 'root.toDate',
};
