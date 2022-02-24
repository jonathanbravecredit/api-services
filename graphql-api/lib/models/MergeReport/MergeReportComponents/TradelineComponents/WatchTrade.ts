import { ICodeRef } from 'lib/interfaces/common.interface';
import { IWatchTrade } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { CodeRef } from 'lib/models/Common/CodeRef';

export class WatchTrade extends Homogenize<Partial<IWatchTrade>> implements IWatchTrade {
  ContactMethod: ICodeRef;
  CreditType: ICodeRef;
  PreviousAccountCondition: ICodeRef;
  previousAmountPastDue: number | string | null = null;
  amountPastDue: number | string | null = null;

  constructor(_data: Partial<IWatchTrade>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.ContactMethod = new CodeRef(this.ContactMethod);
    this.CreditType = new CodeRef(this.CreditType);
    this.PreviousAccountCondition = new CodeRef(this.PreviousAccountCondition);
  }
}
