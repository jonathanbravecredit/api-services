import { IPublicRecordSummaryInfo } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';

export class PublicRecordSummaryInfo extends Homogenize<IPublicRecordSummaryInfo> implements IPublicRecordSummaryInfo {
  NumberOfRecords: number | string | null = null;

  constructor(_data: IPublicRecordSummaryInfo) {
    super(_data);
    this.homogenize(_data);
  }
}
