import { CreditBureauResultsUtil } from 'libs/utils/db/credit-bureau/credit-bureau-results';
import { InvestigationResultsUtil } from 'libs/utils/db/investigation-results/investigation-results';
import { DisputesUtil } from 'libs/utils/db/disputes/disputes';
import { CreditScoreTrackingUtil } from 'libs/utils/db/credit-score-tracking/credit-score-tracking';
import { CreditScoreHistoryUtil } from 'libs/utils/db/credit-scores/credit-score-history';

export class DB {
  static investigationResults = InvestigationResultsUtil;
  static creditBureauResults = CreditBureauResultsUtil;
  static disputes = DisputesUtil;
  static creditScoreTrackings = CreditScoreTrackingUtil;
  static creditScoreHistory = CreditScoreHistoryUtil;
  constructor() {}
}
