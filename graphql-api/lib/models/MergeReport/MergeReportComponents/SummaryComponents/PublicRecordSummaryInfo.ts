import { IPublicRecordSummaryInfo } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';

export class PublicRecordSummaryInfo
  extends Homogenize<Partial<IPublicRecordSummaryInfo>>
  implements IPublicRecordSummaryInfo
{
  NumberOfRecords: number | string | null = null;

  constructor(_data: Partial<IPublicRecordSummaryInfo>) {
    super(_data);
    this.homogenize(_data);
  }
}
