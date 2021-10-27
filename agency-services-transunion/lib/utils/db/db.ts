import { CreditBureauResultsUtil } from 'lib/utils/db/credit-bureau/credit-bureau-results';
import { InvestigationResultsUtil } from 'lib/utils/db/investigation-results/investigation-results';
import { DisputesUtil } from 'lib/utils/db/disputes/disputes';

export class DB {
  static investigationResults = InvestigationResultsUtil;
  static creditBureauResults = CreditBureauResultsUtil;
  static disputes = DisputesUtil;
  constructor() {}
}
