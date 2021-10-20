import {
  createInvestigationResult,
  deleteInvestigationResult,
  describeInvestigationResults,
  getInvestigationResult,
  updateInvestigationResult,
} from 'lib/utils/db/investigation-results/queries/investigation-results.queries';

export class InvestigationResultsUtil {
  constructor() {}

  static create = createInvestigationResult;
  static get = getInvestigationResult;
  static update = updateInvestigationResult;
  static delete = deleteInvestigationResult;
  static describe = describeInvestigationResults;
}
