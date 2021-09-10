import {
  IBorrower,
  IBorrowerAddress,
  IBorrowerName,
  IEmployer,
  IPublicPartition,
  ITradeLinePartition,
} from 'lib/interfaces';

export type PersonalDisputeTypes = 'name' | 'address' | 'employer' | 'unknown';

export interface IProcessDisputeTradelineResult {
  result: IDisputeProcessResult;
  tradeline: ITradeLinePartition | undefined;
}

export interface IProcessDisputePublicResult {
  result: IDisputeProcessResult;
  publicItem: IPublicPartition | undefined;
}

export interface IProcessDisputePersonalResult {
  result: IDisputeProcessResult;
  personalItem: IDisputePersonalItem;
}

export interface IDisputeProcessResult {
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

export interface IDisputePersonalItem extends IPersonalItemsDetailsConfig {}
export interface IPersonalItemsDetailsConfig {
  key: PersonalDisputeTypes;
  value: IBorrowerName | IBorrowerAddress | IEmployer;
  parsedValue: string;
  dateUpdated: string;
  borrower: IBorrower;
  transformed: any;
}
