import { IDispute } from 'lib/interfaces';
import { IStartDisputeResult } from 'lib/interfaces/transunion/start-dispute.interface';
import { Dispute } from 'lib/utils/db/disputes/model/dispute.model';
import * as uuid from 'uuid';

export const createDisputeDBRecord = (
  id: string,
  dispute: IStartDisputeResult,
  items: string,
  openedOn: string,
  closedOn: string,
): IDispute => {
  return {
    id: id,
    disputeId: `${dispute?.DisputeStatus?.DisputeStatusDetail?.DisputeId}`,
    disputeStatus: dispute?.DisputeStatus?.DisputeStatusDetail?.Status || null,
    disputeLetterCode: dispute?.DisputeStatus?.DisputeStatusDetail?.LetterStatus?.DisputeLetterCode || null,
    disputeLetterContent: dispute?.DisputeStatus?.DisputeStatusDetail?.LetterStatus?.DisputeLetterContent || null,
    openDisputes: {
      estimatedCompletionDate:
        dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.EstimatedCompletionDate || null,
      lastUpdatedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.LastUpdatedDate || null,
      openDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.OpenDate || null,
      requestedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.RequestedDate || null,
      totalClosedDisputedItems:
        dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalClosedDisputedItems || null,
      totalDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalDisputedItems || null,
      totalOpenDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalOpenDisputedItems || null,
      totalPVDisputedItemCount:
        dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalPVDisputedItemCount || null,
    },
    closedDisputes: {
      estimatedCompletionDate:
        dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.EstimatedCompletionDate || null,
      lastUpdatedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.LastUpdatedDate || null,
      openDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.OpenDate || null,
      requestedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.RequestedDate || null,
      totalClosedDisputedItems:
        dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalClosedDisputedItems || null,
      totalDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalDisputedItems || null,
      totalOpenDisputedItems:
        dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalOpenDisputedItems || null,
      totalPVDisputedItemCount:
        dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalPVDisputedItemCount || null,
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

export const createUpdateDisputeDBRecord = (dispute: IStartDisputeResult, closedOn: string): Partial<IDispute> => {
  return {
    disputeStatus: dispute?.DisputeStatus?.DisputeStatusDetail?.Status || null,
    disputeLetterCode: dispute?.DisputeStatus?.DisputeStatusDetail?.LetterStatus?.DisputeLetterCode || null,
    disputeLetterContent: dispute?.DisputeStatus?.DisputeStatusDetail?.LetterStatus?.DisputeLetterContent || null,
    openDisputes: {
      estimatedCompletionDate:
        dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.EstimatedCompletionDate || null,
      lastUpdatedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.LastUpdatedDate || null,
      openDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.OpenDate || null,
      requestedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.RequestedDate || null,
      totalClosedDisputedItems:
        dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalClosedDisputedItems || null,
      totalDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalDisputedItems || null,
      totalOpenDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalOpenDisputedItems || null,
      totalPVDisputedItemCount:
        dispute?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes?.TotalPVDisputedItemCount || null,
    },
    closedDisputes: {
      estimatedCompletionDate:
        dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.EstimatedCompletionDate || null,
      lastUpdatedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.LastUpdatedDate || null,
      openDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.OpenDate || null,
      requestedDate: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.RequestedDate || null,
      totalClosedDisputedItems:
        dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalClosedDisputedItems || null,
      totalDisputedItems: dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalDisputedItems || null,
      totalOpenDisputedItems:
        dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalOpenDisputedItems || null,
      totalPVDisputedItemCount:
        dispute?.DisputeStatus?.DisputeStatusDetail?.ClosedDisputes?.TotalPVDisputedItemCount || null,
    },
    closedOn: closedOn,
  };
};
