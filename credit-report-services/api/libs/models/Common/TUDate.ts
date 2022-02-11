import { IDate } from 'libs/interfaces/common.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';

export class TUDate extends Homogenize<IDate> implements IDate {
  month: string | number | null = null;
  year: string | number | null = null;
  day: string | number | null = null;

  constructor(_data: IDate) {
    super(_data);
    this.homogenize(_data);
  }
}
