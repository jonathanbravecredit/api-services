import { IFinancialCounseling } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';

export class FinancialCounseling extends Homogenize<Partial<IFinancialCounseling>> implements IFinancialCounseling {
  amount: number | string | null = null;
  dateChecked: string | null = null;
  dateSettled: string | null = null;

  constructor(_data: Partial<IFinancialCounseling>) {
    super(_data);
    this.homogenize(_data);
  }
}
