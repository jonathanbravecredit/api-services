import { IInquirySummaryInfo } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';

export class InquirySummaryInfo extends Homogenize<Partial<IInquirySummaryInfo>> implements IInquirySummaryInfo {
  NumberInLast2Years: number | string | null = null;

  constructor(_data: Partial<IInquirySummaryInfo>) {
    super(_data);
    this.homogenize(_data);
  }
}
