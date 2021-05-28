import { Customer } from 'lib/models/customer.model';

export class IndicativeEnrichmentModel {
  AccountCode: string;
  AccountName: string;
  RequestKey: string;
  ClientKey: string;
  Customer: Customer;
  ServiceBundleCode: string;
}
