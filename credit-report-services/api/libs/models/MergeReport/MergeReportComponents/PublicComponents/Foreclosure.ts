import { IForeclosure } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';

export class Foreclosure extends Homogenize<IForeclosure> implements IForeclosure {
  dateSettled: string | null = null;
  liability: number | string | null = null;

  constructor(_data: IForeclosure) {
    super(_data);
    this.homogenize(_data);
  }
}
