import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';
import { MergeReport } from 'libs/models/MergeReport/MergeReport';

// add credit report data model
@Model({ tableName: 'CreditReports' })
export class CreditReport {
  @PartitionKey()
  userId: string;

  @SortKey()
  version: number;

  currentVersion: number;

  bureau: string;

  creditReport: MergeReport;

  createOn: string | null;

  modifiedOn: string | null;
}
