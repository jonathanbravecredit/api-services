import { ICodeRef, ISource } from 'lib/interfaces/common.interface';
import { ICreditAddress, ISubscriber } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { CodeRef } from 'lib/models/Common/CodeRef';
import { Source } from 'lib/models/Common/Source';
import { CreditAddress } from 'lib/models/Common/CreditAddress';

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
