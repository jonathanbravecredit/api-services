import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'CreditBureauReportResults' })
export class CreditBureauReportResult {
  @PartitionKey()
  id: string;

  @SortKey()
  userId: string;

  record: string;

  createdOn: string;

  modifiedOn: string;
}
