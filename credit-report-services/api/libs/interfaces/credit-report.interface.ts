import { IMergeReport } from 'libs/interfaces/merge-report.interface';

export interface ICreditReport {
  userId: string;
  version: number;
  agency: string;
  report: IMergeReport;
  createdOn: string;
  modifiedOn: string;
}
