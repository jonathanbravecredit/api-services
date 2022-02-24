import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model({ tableName: 'Disputes' })
export class Dispute {
  @PartitionKey()
  id: string;

  @SortKey()
  disputeId: string;

  agencyName: string;

  disputeStatus: string;

  disputeLetterCode: string;

  disputeLetterContent: string;

  openDisputes: DisputeSummary;

  closedDisputes: DisputeSummary;

  pvDisputedItems: PVDisputedItems | null;

  openedOn: string;

  closedOn: string;

  disputeItems: string;

  disputeInvestigationResults: string;

  disputeCreditBureau: string;

  notificationStatus: string;

  notificationMessage: string;

  notificationSentOn: string;

  createdOn: string | null;

  modifiedOn: string | null;
}

export type DisputeSummary = {
  estimatedCompletionDate: string;
  lastUpdatedDate: string;
  openDate: string;
  requestedDate: string;
  totalClosedDisputedItems: string;
  totalDisputedItems: string;
  totalOpenDisputedItems: string;
  totalPVDisputedItemCount: string;
};

export type PVDisputedItems = {
  pvTradelines: string;
  pvPublicRecords: string;
};
