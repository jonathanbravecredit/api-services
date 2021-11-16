import {
  createCreditScoreTracking,
  getCreditScoreTracking,
  updateCreditScoreTracking,
  deleteCreditScoreTracking,
  describeCreditScoreTrackings,
  listCreditScoresTrackings,
} from 'lib/utils/db/credit-score-tracking/queries/credit-score-tracking.queries';

export class CreditScoreTrackingUtil {
  constructor() {}

  static create = createCreditScoreTracking;
  static get = getCreditScoreTracking;
  static list = listCreditScoresTrackings;
  static update = updateCreditScoreTracking;
  static delete = deleteCreditScoreTracking;
  static describe = describeCreditScoreTrackings;
}
