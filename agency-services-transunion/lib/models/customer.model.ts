import { CurrentAddress } from 'lib/models/current-address.model';
import { FullName } from 'lib/models/full-name.model';
import { PreviousAddress } from 'lib/models/previous-address.model';

export class Customer {
  'data:CurrentAddress': CurrentAddress;
  'data:PreviousAddress': PreviousAddress | undefined;
  'data:DateOfBirth': string;
  'data:FullName': FullName;
  'data:Ssn': string;
}
