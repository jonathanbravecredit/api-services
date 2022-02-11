import { IInquirySummaryInfo } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';

export class InquirySummaryInfo extends Homogenize<IInquirySummaryInfo> implements IInquirySummaryInfo {
  NumberInLast2Years: number | string | null = null;

  constructor(_data: IInquirySummaryInfo) {
    super(_data);
    this.homogenize(_data);
  }
}
