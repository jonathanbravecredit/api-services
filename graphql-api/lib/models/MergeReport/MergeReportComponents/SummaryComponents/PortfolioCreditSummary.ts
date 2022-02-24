import { IPortfolioCreditSummary, IPortfolioCreditSummaryInfo } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { PortfolioCreditSummaryInfo } from 'lib/models/MergeReport/MergeReportComponents/SummaryComponents/PortfolioCreditSummaryInfo';

export class PortfolioCreditSummary
  extends Homogenize<Partial<IPortfolioCreditSummary>>
  implements IPortfolioCreditSummary
{
  Transunion: IPortfolioCreditSummaryInfo;

  constructor(_data: Partial<IPortfolioCreditSummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Transunion = new PortfolioCreditSummaryInfo(this.Transunion);
  }
}
