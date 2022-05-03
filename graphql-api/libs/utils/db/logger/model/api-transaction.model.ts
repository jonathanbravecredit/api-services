import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'APITransactionLog' })
export class APITransactionLog {
  @PartitionKey()
  userId: string;

  @SortKey()
  transactionId: string;

  action: string;

  transaction: string;

  createdOn: string;
}
