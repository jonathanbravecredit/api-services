import { IPublicPartition, IPublicRecord } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { PublicRecord } from 'lib/models/MergeReport/MergeReportComponents/PublicComponents/PublicRecord';

export class PublicPartition extends Homogenize<Partial<IPublicPartition>> implements IPublicPartition {
  PublicRecord: IPublicRecord;

  constructor(_data: Partial<IPublicPartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.PublicRecord = new PublicRecord(this.PublicRecord);
  }
}
