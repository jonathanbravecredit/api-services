import { IMonthyPayStatusItem, IPayStatusHistory } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { MonthlyPayStatusItem } from 'libs/models/MergeReport/MergeReportComponents/TradelineComponents/MonthlyPayStatusItem';

export class PayStatusHistory extends Homogenize<Partial<IPayStatusHistory>> implements IPayStatusHistory {
  MonthlyPayStatus: IMonthyPayStatusItem[] = [];
  startDate: string | null = null;
  status: string | null = null;

  constructor(_data: Partial<IPayStatusHistory>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.MonthlyPayStatus = this.homogenizeArray<IMonthyPayStatusItem, MonthlyPayStatusItem>(
      this.MonthlyPayStatus,
      MonthlyPayStatusItem,
    );
  }
}
