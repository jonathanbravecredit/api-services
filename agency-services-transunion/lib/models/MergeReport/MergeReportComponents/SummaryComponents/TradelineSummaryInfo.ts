import { ICodeRef } from 'lib/interfaces/common.interface';
import { ITradelineSummaryInfo } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { CodeRef } from 'lib/models/Common/CodeRef';

export class TradelineSummaryInfo extends Homogenize<Partial<ITradelineSummaryInfo>> implements ITradelineSummaryInfo {
  RecentDeliquencyMOP: ICodeRef;
  TotalHistoricalNegatives: number | string | null = null;
  OpenCollectionAccounts: number | string | null = null;
  TotalCollectionAccounts: number | string | null = null;
  HistoricalNegativeAccounts: number | string | null = null;
  TotalInstallmentAccounts: number | string | null = null;
  OpenInstallmentAccounts: number | string | null = null;
  TotalOtherAccounts: number | string | null = null;
  OpenOtherAccounts: number | string | null = null;
  OpenMortgageAccounts: number | string | null = null;
  RecentDeliquencyDate: string | null = null;
  TotalMortgageAccounts: number | string | null = null;
  DelinquentAccounts: number | string | null = null;
  DerogatoryAccounts: number | string | null = null;
  CloseAccounts: number | string | null = null;
  TotalAccounts: number | string | null = null;
  OpenAccounts: number | string | null = null;
  TotalRevolvingAccounts: number | string | null = null;
  OpenRevolvingAccounts: number | string | null = null;
  CreditSummaryPeriod: string | null = null;
  TotalBalances: number | string | null = null;
  TotalMonthlyPayments: number | string | null = null;
  AgeofCredit: number | string | null = null;

  constructor(_data: Partial<ITradelineSummaryInfo>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.RecentDeliquencyMOP = new CodeRef(this.RecentDeliquencyMOP);
  }
}
