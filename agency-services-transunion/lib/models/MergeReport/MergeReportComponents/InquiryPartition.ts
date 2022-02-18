import { IInquiry, IInquiryPartition, IInquirySummaryInfo } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { Inquiry } from 'lib/models/MergeReport/MergeReportComponents/InquiryComponents/Inquiry';

export class InquiryPartition extends Homogenize<Partial<IInquiryPartition>> implements IInquiryPartition {
  Inquiry: IInquiry;

  constructor(_data: Partial<IInquiryPartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Inquiry = new Inquiry(this.Inquiry);
  }
}
