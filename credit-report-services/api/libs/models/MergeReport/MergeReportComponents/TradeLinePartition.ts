import { ITradeline, ITradeLinePartition } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { Tradeline } from 'libs/models/MergeReport/MergeReportComponents/Tradeline';

export class TradeLinePartition extends Homogenize<ITradeLinePartition> implements ITradeLinePartition {
  Tradeline: ITradeline;
  accountTypeDescription: string | null = null;
  accountTypeSymbol: string | null = null;
  accountTypeAbbreviation: string | null = null;

  constructor(_data: ITradeLinePartition) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Tradeline = new Tradeline(this.Tradeline);
  }
}
