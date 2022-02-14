import {
  IAccountHistorySummary,
  IInquirySummary,
  IPortfolioCreditSummary,
  IPublicRecordSummary,
  ISummary,
  ITradelineSummary,
} from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { AccountHistorySummary } from 'libs/models/MergeReport/MergeReportComponents/SummaryComponents/AccountHistorySummary';
import { InquirySummary } from 'libs/models/MergeReport/MergeReportComponents/SummaryComponents/InquirySummary';
import { PortfolioCreditSummary } from 'libs/models/MergeReport/MergeReportComponents/SummaryComponents/PortfolioCreditSummary';
import { PublicRecordSummary } from 'libs/models/MergeReport/MergeReportComponents/SummaryComponents/PublicRecordSummary';
import { TradelineSummary } from 'libs/models/MergeReport/MergeReportComponents/SummaryComponents/TradelineSummary';

export class Summary extends Homogenize<Partial<ISummary>> implements ISummary {
  TradelineSummary: ITradelineSummary;
  InquirySummary: IInquirySummary;
  PublicRecordSummary: IPublicRecordSummary;
  PortfolioCreditSummary: IPortfolioCreditSummary[] = [];
  AccountHistorySummary: IAccountHistorySummary[] = [];

  constructor(_data: Partial<ISummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.TradelineSummary = new TradelineSummary(this.TradelineSummary);
    this.InquirySummary = new InquirySummary(this.InquirySummary);
    this.PublicRecordSummary = new PublicRecordSummary(this.PublicRecordSummary);
    this.PortfolioCreditSummary = this.homogenizeArray<IPortfolioCreditSummary, PortfolioCreditSummary>(
      this.PortfolioCreditSummary,
      PortfolioCreditSummary,
    );
    this.AccountHistorySummary = this.homogenizeArray<IAccountHistorySummary, AccountHistorySummary>(
      this.AccountHistorySummary,
      AccountHistorySummary,
    );
  }
}
