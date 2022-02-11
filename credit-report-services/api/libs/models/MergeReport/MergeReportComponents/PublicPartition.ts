import { IPublicPartition, IPublicRecord } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { PublicRecord } from 'libs/models/MergeReport/MergeReportComponents/PublicComponents/PublicRecord';

export class PublicPartition extends Homogenize<IPublicPartition> implements IPublicPartition {
  PublicRecord: IPublicRecord;

  constructor(_data: IPublicPartition) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.PublicRecord = new PublicRecord(this.PublicRecord);
  }
}
