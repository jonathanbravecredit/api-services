import { IInquirySummaryInfo } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';

export class InquirySummaryInfo extends Homogenize<Partial<IInquirySummaryInfo>> implements IInquirySummaryInfo {
  NumberInLast2Years: number | string | null = null;

  constructor(_data: Partial<IInquirySummaryInfo>) {
    super(_data);
    this.homogenize(_data);
  }
}
