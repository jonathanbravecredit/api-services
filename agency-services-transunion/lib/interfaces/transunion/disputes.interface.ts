import { ITradeLinePartition } from 'lib/interfaces/merge-report.interface';

export interface IProcessDisputeTradelineResult {
  result: IDisputeTradelineProcessResult;
  tradeline: ITradeLinePartition | undefined;
}

export interface IDisputeTradelineProcessResult {
  isFinished: boolean;
  data: {
    hasCustomInput: boolean;
    customInput: string;
    reasonsId: [string | undefined, string | undefined];
    reasons?: [IDisputeReason | undefined, IDisputeReason | undefined];
  };
}

export interface IDisputeReason {
  id: string;
  text: string;
  claimCode: string;
  userInputDescriptionText?: string | null;
}
