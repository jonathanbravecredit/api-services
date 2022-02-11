import { ICodeRef } from 'libs/interfaces/common.interface';
import { IWatchTrade } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';

export class WatchTrade extends Homogenize<IWatchTrade> implements IWatchTrade {
  ContactMethod: ICodeRef;
  CreditType: ICodeRef;
  PreviousAccountCondition: ICodeRef;
  previousAmountPastDue: number | string | null = null;
  amountPastDue: number | string | null = null;

  constructor(_data: IWatchTrade) {
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
