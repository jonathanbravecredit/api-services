import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';
import { IMergeReport } from 'libs/interfaces/merge-report.interface';
import { MergeReport } from 'libs/models/MergeReport/MergeReport';

// add credit report data model
@Model({ tableName: 'CreditReports' })
export class CreditReport {
  @PartitionKey()
  userId: string;

  @SortKey()
  version: number;

  currentVersion: number | undefined;

  bureau: string;

  report: IMergeReport;

  createdOn: string | null;

  modifiedOn: string | null;
}

export class CreditReportMaker implements CreditReport {
  createdOn: string | null;
  modifiedOn: string | null;
  currentVersion: number | undefined;

  constructor(
    public userId: string,
    public bureau: string,
    public report: IMergeReport,
    public version: number = new Date().valueOf(),
  ) {
    this.report = new MergeReport(this.report);
    this.createdOn = new Date().toISOString();
    this.modifiedOn = new Date().toISOString();
  }

  setCurrentVersion(val: number) {
    this.currentVersion = val;
  }
}
