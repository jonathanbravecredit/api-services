import { IGarnishment } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';

export class Garnishment extends Homogenize<Partial<IGarnishment>> implements IGarnishment {
  amount: number | string | null = null;
  dateSatisfied: string | null = null;
  garnishee: string | null = null;
  plaintiff: string | null = null;

  constructor(_data: Partial<IGarnishment>) {
    super(_data);
    this.homogenize(_data);
  }
}
