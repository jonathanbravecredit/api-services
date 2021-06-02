import { Customer } from 'lib/models/customer.model';

export class IndicativeEnrichmentModel {
  'data:AccountCode': string;
  'data:AccountName': string;
  'data:RequestKey': string;
  'data:ClientKey': string;
  'data:Customer': Customer;
  'data:ServiceBundleCode': string;
}
