import { IMonthyPayStatusItem, IPayStatusHistory } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { MonthlyPayStatusItem } from 'libs/models/MergeReport/MergeReportComponents/MonthlyPayStatusItem';

export class PayStatusHistory extends Homogenize<IPayStatusHistory> implements IPayStatusHistory {
  MonthlyPayStatus: IMonthyPayStatusItem[] = [];
  startDate: string | null = null;
  status: string | null = null;

  constructor(_data: IPayStatusHistory) {
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
