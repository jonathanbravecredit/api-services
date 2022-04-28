import { ACCOUNT_CODE } from 'lib/data/constants';
import { v4 } from 'uuid';

export const DefaultRequestMap = {
  AccountCode: ACCOUNT_CODE,
  AccountName: ACCOUNT_CODE,
  AdditionalInputs: {
    Data: {
      Name: 'CreditReportVersion',
      Value: '7.1',
    },
  },
  RequestKey: `BC-${v4()}`,
};

export const IndicativeEnrichmentRequestMap = {
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
  'Customer.Ssn': 'root.ssn.lastfour',
  ServiceBundleCode: 'root.serviceBundleCode',
};
