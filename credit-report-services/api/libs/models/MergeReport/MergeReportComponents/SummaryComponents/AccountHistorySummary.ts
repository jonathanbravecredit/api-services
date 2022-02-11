import { IAccountHistorySummary, IAccountHistorySummaryInfo } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { AccountHistorySummaryInfo } from 'libs/models/MergeReport/MergeReportComponents/SummaryComponents/AccountHistorySummaryInfo';

export class AccountHistorySummary extends Homogenize<IAccountHistorySummary> implements IAccountHistorySummary {
  Transunion: IAccountHistorySummaryInfo;

  constructor(_data: IAccountHistorySummary) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Transunion = new AccountHistorySummaryInfo(this.Transunion);
  }
}
