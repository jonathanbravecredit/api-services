import { IPhoneNumber } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';

export class PhoneNumber extends Homogenize<IPhoneNumber> implements IPhoneNumber {
  AreaCode: string | null = null;
  Number: string | null = null;
  Extension: string | null = null;

  constructor(_data: IPhoneNumber) {
    super(_data);
    this.homogenize(_data);
  }
}
