import { ICreditScoreFactor } from '@bravecredit/brave-sdk/dist/types/merge-report';
import { ICodeRef, ISource } from 'libs/interfaces';

export interface IVantageScore {
  CreditScoreType: ICreditScoreType;
}

export interface ICreditScoreType {
  riskScore?: number;
  scoreName?: string;
  populationRank?: number;
  CreditScoreFactor?: ICreditScoreFactor[];
  CreditScoreModel?: ICodeRef;
  NoScoreReason?: ICodeRef;
  Source?: ISource;
}
