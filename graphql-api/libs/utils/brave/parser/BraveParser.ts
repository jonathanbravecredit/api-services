import { IMergeReport } from '@bravecredit/brave-sdk';

export class BraveParsers {
  constructor() {}

  static parseTransunionMergeReport(serviceProduct: IMergeReport | string): IMergeReport {
    const spo1: IMergeReport | string =
      typeof serviceProduct === 'string'
        ? JSON.parse(serviceProduct)
        : serviceProduct.TrueLinkCreditReportType
        ? serviceProduct
        : {};
    const spo2: IMergeReport = typeof spo1 === 'string' ? JSON.parse(spo1) : spo1.TrueLinkCreditReportType ? spo1 : {};
    return spo2 ? spo2 : ({} as IMergeReport);
  }
}
