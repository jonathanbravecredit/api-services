import { IInquiry, IInquiryPartition, IInquirySummaryInfo } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { Inquiry } from 'libs/models/MergeReport/MergeReportComponents/InquiryComponents/Inquiry';

export class InquiryPartition extends Homogenize<IInquiryPartition> implements IInquiryPartition {
  Inquiry: IInquiry;

  constructor(_data: IInquiryPartition) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Inquiry = new Inquiry(this.Inquiry);
  }
}
