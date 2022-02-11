import { IPortfolioCreditSummary, IPortfolioCreditSummaryInfo } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { PortfolioCreditSummaryInfo } from 'libs/models/MergeReport/MergeReportComponents/SummaryComponents/PortfolioCreditSummaryInfo';

export class PortfolioCreditSummary extends Homogenize<IPortfolioCreditSummary> implements IPortfolioCreditSummary {
  Transunion: IPortfolioCreditSummaryInfo;

  constructor(_data: IPortfolioCreditSummary) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Transunion = new PortfolioCreditSummaryInfo(this.Transunion);
  }
}
