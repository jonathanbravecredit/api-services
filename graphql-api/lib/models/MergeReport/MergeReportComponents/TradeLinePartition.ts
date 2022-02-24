import { ITradeline, ITradeLinePartition } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { Tradeline } from 'lib/models/MergeReport/MergeReportComponents/TradelineComponents/Tradeline';

export class TradeLinePartition extends Homogenize<Partial<ITradeLinePartition>> implements ITradeLinePartition {
  Tradeline: ITradeline;
  accountTypeDescription: string | null = null;
  accountTypeSymbol: string | null = null;
  accountTypeAbbreviation: string | null = null;

  constructor(_data: Partial<ITradeLinePartition>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Tradeline = new Tradeline(this.Tradeline);
  }
}
