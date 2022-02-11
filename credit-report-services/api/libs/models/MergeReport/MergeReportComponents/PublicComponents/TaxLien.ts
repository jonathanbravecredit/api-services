import { ITaxLien } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';

export class TaxLien extends Homogenize<ITaxLien> implements ITaxLien {
  amount: number | string | null = null;
  dateReleased: string | null = null;

  constructor(_data: ITaxLien) {
    super(_data);
    this.homogenize(_data);
  }
}
