import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { IInquiry } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';
import { Source } from 'libs/models/Common/Source';

export class Inquiry extends Homogenize<Partial<IInquiry>> implements IInquiry {
  IndustryCode: ICodeRef;
  Source: ISource;
  bureau: string | null = null;
  inquiryType: string | null = null;
  subscriberNumber: string | null = null;
  inquiryDate: string | null = null;
  subscriberName: string | null = null;

  constructor(_data: Partial<IInquiry>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.IndustryCode = new CodeRef(this.IndustryCode);
    this.Source = new Source(this.Source);
  }
}
