import { IDate, ISource } from 'lib/interfaces/common.interface';
import { IBorrowerBirth } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { Source } from 'lib/models/Common/Source';
import { TUDate } from 'lib/models/Common/TUDate';

export class BorrowerBirth extends Homogenize<Partial<IBorrowerBirth>> implements IBorrowerBirth {
  BirthDate: IDate;
  Source: ISource;
  date: string | null = null;
  age: number | null = null;
  partitionSet: number | string | null = null;

  constructor(_data: Partial<IBorrowerBirth>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.BirthDate = new TUDate(this.BirthDate);
    this.Source = new Source(this.Source);
  }
}
