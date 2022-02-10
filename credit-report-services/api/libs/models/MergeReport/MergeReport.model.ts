import { IMergeReport, ITrueLinkCreditReportType } from 'libs/interfaces/merge-report.interface';

export class MergeReport implements IMergeReport {
  constructor(public TrueLinkCreditReportType: ITrueLinkCreditReportType) {}
}
