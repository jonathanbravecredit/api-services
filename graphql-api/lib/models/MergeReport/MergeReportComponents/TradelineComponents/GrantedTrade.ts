import { ICodeRef } from 'lib/interfaces/common.interface';
import { IGrantedTrade, IPayStatusHistory } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { CodeRef } from 'lib/models/Common/CodeRef';
import { PayStatusHistory } from 'lib/models/MergeReport/MergeReportComponents/TradelineComponents/PayStatusHistory';

export class GrantedTrade extends Homogenize<Partial<IGrantedTrade>> implements IGrantedTrade {
  AccountType: ICodeRef;
  CreditType: ICodeRef;
  PaymentFrequency: ICodeRef;
  TermType: ICodeRef;
  WorstPayStatus: ICodeRef;
  PayStatusHistory: IPayStatusHistory;
  CreditLimit: number | string | null = null;
  monthsReviewed: number | string | null = null;
  monthlyPayment: number | string | null = null;
  late90Count: number | string | null = null;
  late60Count: number | string | null = null;
  late30Count: number | string | null = null;
  actualPaymentAmount: number | string | null = null;
  worstPatStatusCount: number | string | null = null;
  termMonths: number | string | null = null;
  dateLastPayment: string | null = null;
  collateral: string | null = null;
  amountPastDue: number | string | null = null;
  dateWorstPayStatus: string | null = null;
  datePastDue: string | null = null;

  constructor(_data: Partial<IGrantedTrade>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.AccountType = new CodeRef(this.AccountType);
    this.CreditType = new CodeRef(this.CreditType);
    this.PaymentFrequency = new CodeRef(this.PaymentFrequency);
    this.TermType = new CodeRef(this.TermType);
    this.WorstPayStatus = new CodeRef(this.WorstPayStatus);
    this.PayStatusHistory = new PayStatusHistory(this.PayStatusHistory);
  }
}
