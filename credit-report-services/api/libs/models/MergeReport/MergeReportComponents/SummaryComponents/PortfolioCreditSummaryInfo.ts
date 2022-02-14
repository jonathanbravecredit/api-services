import { ICodeRef } from 'libs/interfaces/common.interface';
import { IPortfolioCreditSummaryInfo } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';

export class PortfolioCreditSummaryInfo
  extends Homogenize<Partial<IPortfolioCreditSummaryInfo>>
  implements IPortfolioCreditSummaryInfo
{
  SummaryType: ICodeRef;
  CurrentPaymentDueAmount: number | string | null = null;
  PriorPaymentDueAmount: number | string | null = null;
  CurrentActualPaymentAmount: number | string | null = null;
  PastDueAmount: number | string | null = null;
  CreditLimitAmount: number | string | null = null;
  BalanceAmount: number | string | null = null;

  constructor(_data: Partial<IPortfolioCreditSummaryInfo>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.SummaryType = new CodeRef(this.SummaryType);
  }
}
