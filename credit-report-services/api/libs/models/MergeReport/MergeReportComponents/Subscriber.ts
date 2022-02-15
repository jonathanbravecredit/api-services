import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { ICreditAddress, ISubscriber } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';
import { Source } from 'libs/models/Common/Source';
import { CreditAddress } from 'libs/models/Common/CreditAddress';

export class Subscriber extends Homogenize<Partial<ISubscriber>> implements ISubscriber {
  CreditAddress: ICreditAddress;
  IndustryCode: ICodeRef;
  Source: ISource;
  subscriberCode: string | null = null;
  telephone: string | null = null;
  name: string | null = null;

  constructor(_data: Partial<ISubscriber>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.CreditAddress = new CreditAddress(this.CreditAddress);
    this.IndustryCode = new CodeRef(this.IndustryCode);
    this.Source = new Source(this.Source);
  }
}
