import { IAccountHistorySummary, IAccountHistorySummaryInfo } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { AccountHistorySummaryInfo } from 'lib/models/MergeReport/MergeReportComponents/SummaryComponents/AccountHistorySummaryInfo';

export class AccountHistorySummary
  extends Homogenize<Partial<IAccountHistorySummary>>
  implements IAccountHistorySummary
{
  Transunion: IAccountHistorySummaryInfo;

  constructor(_data: Partial<IAccountHistorySummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Transunion = new AccountHistorySummaryInfo(this.Transunion);
  }
}
