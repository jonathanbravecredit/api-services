import { ISocial, ISocialPartition } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { Social } from 'lib/models/MergeReport/MergeReportComponents/BorrowerComponents/Social';

export class SocialPartition extends Homogenize<Partial<ISocialPartition>> implements ISocialPartition {
  Social: ISocial[] = [];

  constructor(_data: Partial<ISocialPartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Social = this.homogenizeArray<ISocial, Social>(this.Social, Social);
  }
}
