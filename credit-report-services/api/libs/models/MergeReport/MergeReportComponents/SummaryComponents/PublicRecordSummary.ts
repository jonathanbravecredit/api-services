import { IPublicRecordSummary, IPublicRecordSummaryInfo } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { PublicRecordSummaryInfo } from 'libs/models/MergeReport/MergeReportComponents/SummaryComponents/PublicRecordSummaryInfo';

export class PublicRecordSummary extends Homogenize<IPublicRecordSummary> implements IPublicRecordSummary {
  Experian: IPublicRecordSummaryInfo;
  Equifax: IPublicRecordSummaryInfo;
  Transunion: IPublicRecordSummaryInfo;
  Merge: IPublicRecordSummaryInfo;

  constructor(_data: IPublicRecordSummary) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Experian = new PublicRecordSummaryInfo(this.Experian);
    this.Equifax = new PublicRecordSummaryInfo(this.Equifax);
    this.Transunion = new PublicRecordSummaryInfo(this.Transunion);
    this.Merge = new PublicRecordSummaryInfo(this.Merge);
  }
}
