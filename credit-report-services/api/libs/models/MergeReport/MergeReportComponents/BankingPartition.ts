import { IBankingPartition, IBankingRecord } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { BankingRecord } from 'libs/models/MergeReport/MergeReportComponents/BankingComponents/BankingRecord';

export class BankingPartition extends Homogenize<Partial<IBankingPartition>> implements IBankingPartition {
  BankingRecord: IBankingRecord[] = [];

  constructor(_data: Partial<IBankingPartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.BankingRecord = this.homogenizeArray<IBankingRecord, BankingRecord>(this.BankingRecord, BankingRecord);
  }
}
