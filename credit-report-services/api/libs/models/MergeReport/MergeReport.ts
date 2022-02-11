import { IMergeReport, ITrueLinkCreditReportType } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { TrueLinkCreditReportType } from 'libs/models/MergeReport/MergeReportComponents/TrueLinkCreditReport';

/**
 * Rules for merge report.
 * 1. primatives can terminate in null (defaults must be set)
 * 2. no primatives can be missing from a leaf
 * 3. arrays can terminate in an empty array (defaults must be set)
 * 4. complex objects CANNOT terminate in a null. Must go to leaves
 */
export class MergeReport extends Homogenize<IMergeReport> implements IMergeReport {
  TrueLinkCreditReportType: ITrueLinkCreditReportType;
  constructor(_data: IMergeReport) {
    super(_data);
    this.homogenize(_data);
    this.init;
  }

  init(): void {
    this.TrueLinkCreditReportType = new TrueLinkCreditReportType(this.TrueLinkCreditReportType);
  }
}
