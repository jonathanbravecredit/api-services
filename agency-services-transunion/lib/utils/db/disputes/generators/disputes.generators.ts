import { IStartDisputeResult } from 'lib/interfaces/transunion/start-dispute.interface';
import { Dispute } from 'lib/utils/db/disputes/model/dispute.model';
import { DisputeInput } from 'src/api/api.service';
import * as uuid from 'uuid';

export const createDisputeDBRecord = (
  id: string,
  dispute: IStartDisputeResult,
  items: string,
  openedOn: string,
  closedOn: string,
): Dispute => {
  return {
    id: id,
    disputeId: dispute?.DisputeStatus?.DisputeStatusDetail?.DisputeId,
    disputeStatus: dispute?.DisputeStatus?.DisputeStatusDetail?.Status,
    disputeLetterCode: dispute?.DisputeStatus?.DisputeStatusDetail?.LetterStatus.DisputeLetterCode,
    disputeLetterContent: dispute?.DisputeStatus?.DisputeStatusDetail?.LetterStatus.DisputeLetterContent,
    openDisputes: {
      estimatedCompletionDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.EstimatedCompletionDate,
      lastUpdatedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.LastUpdatedDate,
      openDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.OpenDate,
      requestedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.RequestedDate,
      totalClosedDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalClosedDisputedItems,
      totalDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalDisputedItems,
      totalOpenDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalOpenDisputedItems,
      totalPVDisputedItemCount: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalPVDisputedItemCount,
    },
    closedDisputes: {
      estimatedCompletionDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.EstimatedCompletionDate,
      lastUpdatedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.LastUpdatedDate,
      openDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.OpenDate,
      requestedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.RequestedDate,
      totalClosedDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalClosedDisputedItems,
      totalDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalDisputedItems,
      totalOpenDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalOpenDisputedItems,
      totalPVDisputedItemCount: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalPVDisputedItemCount,
    },
    pvDisputedItems: null,
    agencyName: 'TU',
    openedOn: openedOn,
    closedOn: closedOn,
    disputeItems: items,
    disputeInvestigationResults: null,
    disputeCreditBureau: null,
    notificationStatus: null,
    notificationMessage: null,
    notificationSentOn: null,
    createdOn: openedOn,
    modifiedOn: openedOn,
  };
};

export const createDisputeInputRecord = (
  id: string,
  dispute: IStartDisputeResult,
  items: string,
  openedOn: string,
  closedOn: string,
): DisputeInput => {
  return {
    id: uuid.v4(),
    appDataId: id,
    disputeId: dispute?.DisputeStatus?.DisputeStatusDetail?.DisputeId,
    disputeStatus: dispute?.DisputeStatus?.DisputeStatusDetail?.Status,
    disputeLetterCode: dispute?.DisputeStatus?.DisputeStatusDetail?.LetterStatus.DisputeLetterCode,
    disputeLetterContent: dispute?.DisputeStatus?.DisputeStatusDetail?.LetterStatus.DisputeLetterContent,
    openDisputes: {
      estimatedCompletionDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.EstimatedCompletionDate,
      lastUpdatedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.LastUpdatedDate,
      openDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.OpenDate,
      requestedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.RequestedDate,
      totalClosedDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalClosedDisputedItems,
      totalDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalDisputedItems,
      totalOpenDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalOpenDisputedItems,
      totalPVDisputedItemCount: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalPVDisputedItemCount,
    },
    closedDisputes: {
      estimatedCompletionDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.EstimatedCompletionDate,
      lastUpdatedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.LastUpdatedDate,
      openDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.OpenDate,
      requestedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.RequestedDate,
      totalClosedDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalClosedDisputedItems,
      totalDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalDisputedItems,
      totalOpenDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalOpenDisputedItems,
      totalPVDisputedItemCount: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalPVDisputedItemCount,
    },
    agencyName: 'TU',
    openedOn: openedOn,
    closedOn: closedOn,
    disputeItems: items,
    disputeInvestigationResults: null,
    disputeCreditBureau: null,
    notificationStatus: null,
    notificationMessage: null,
    notificationSentOn: null,
  };
};

export const createUpdateDisputeDBRecord = (
  dispute: IStartDisputeResult,
  openedOn: string,
  closedOn: string,
): Partial<Dispute> => {
  return {
    disputeStatus: dispute?.DisputeStatus?.DisputeStatusDetail?.Status,
    disputeLetterCode: dispute?.DisputeStatus?.DisputeStatusDetail?.LetterStatus.DisputeLetterCode,
    disputeLetterContent: dispute?.DisputeStatus?.DisputeStatusDetail?.LetterStatus.DisputeLetterContent,
    openDisputes: {
      estimatedCompletionDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.EstimatedCompletionDate,
      lastUpdatedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.LastUpdatedDate,
      openDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.OpenDate,
      requestedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.RequestedDate,
      totalClosedDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalClosedDisputedItems,
      totalDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalDisputedItems,
      totalOpenDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalOpenDisputedItems,
      totalPVDisputedItemCount: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalPVDisputedItemCount,
    },
    closedDisputes: {
      estimatedCompletionDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.EstimatedCompletionDate,
      lastUpdatedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.LastUpdatedDate,
      openDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.OpenDate,
      requestedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.RequestedDate,
      totalClosedDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalClosedDisputedItems,
      totalDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalDisputedItems,
      totalOpenDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalOpenDisputedItems,
      totalPVDisputedItemCount: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalPVDisputedItemCount,
    },
    openedOn: openedOn,
    closedOn: closedOn,
    createdOn: openedOn,
    modifiedOn: openedOn,
  };
};