import { IPhoneNumber } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';

export class PhoneNumber extends Homogenize<Partial<IPhoneNumber>> implements IPhoneNumber {
  AreaCode: string | null = null;
  Number: string | null = null;
  Extension: string | null = null;

  constructor(_data: Partial<IPhoneNumber>) {
    super(_data);
    this.homogenize(_data);
  }
}
