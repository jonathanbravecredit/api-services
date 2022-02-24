import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'APIErrorLog' })
export class APIErrorLog {
  @PartitionKey()
  userId: string;

  @SortKey()
  errorId: string;

  action: string;

  error: string;

  createdOn: string;
}
