import { CurrentAddress } from 'lib/models/current-address.model';
import { FullName } from 'lib/models/full-name.model';
import { PreviousAddress } from 'lib/models/previous-address.model';

export class Customer {
  CurrentAddress: CurrentAddress;
  PreviousAddress: PreviousAddress | undefined;
  DateOfBirth: string;
  FullName: FullName;
  Ssn: string;
}
