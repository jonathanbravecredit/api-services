import {
  createCreditBureauReportResult,
  deleteCreditBureauReportResult,
  describeCreditBureauReportResults,
  getCreditBureauReportResult,
  updateCreditBureauReportResult,
} from 'libs/utils/db/credit-bureau/queries/credit-bureau-report-results.queries';

export class CreditBureauResultsUtil {
  constructor() {}

  static create = createCreditBureauReportResult;
  static get = getCreditBureauReportResult;
  static update = updateCreditBureauReportResult;
  static delete = deleteCreditBureauReportResult;
  static describe = describeCreditBureauReportResults;
}
