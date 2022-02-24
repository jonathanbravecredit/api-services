import {
  createCreditScore,
  getCreditScore,
  deleteCreditScore,
  listCreditScores,
} from 'lib/utils/db/credit-scores/queries/creditscores.queries';

export class CreditScoreHistoryUtil {
  constructor() {}

  static create = createCreditScore;
  static get = getCreditScore;
  static list = listCreditScores;
  static delete = deleteCreditScore;
}
