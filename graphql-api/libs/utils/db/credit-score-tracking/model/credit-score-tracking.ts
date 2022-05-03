import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'CreditScoreTrackings' })
export class CreditScoreTracking {
  @PartitionKey()
  userId: string;
  @SortKey()
  bureauId: string;
  priorScore: number | null;
  currentScore: number | null;
  delta: number | null;
  createdOn: string | null;
  modifiedOn: string | null;
}
