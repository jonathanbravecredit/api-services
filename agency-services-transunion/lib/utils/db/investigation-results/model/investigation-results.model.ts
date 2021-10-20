import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'InvestigationResults' })
export class InvestigationResult {
  @PartitionKey()
  id: string;

  @SortKey()
  userId: string;

  record: string;

  createdOn: string;

  modifiedOn: string;
}
