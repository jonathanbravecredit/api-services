import { ISource, ISourceSummary } from 'libs/interfaces/common.interface';
import {
  IBankingPartition,
  IBorrower,
  IInquiryPartition,
  IMessage,
  IPublicPartition,
  ISB168Frozen,
  ISubscriber,
  ISummary,
  ITradeLinePartition,
  ITrueLinkCreditReportType,
} from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { SourceSummary } from 'libs/models/Common/SourceSummary';
import { Borrower } from 'libs/models/MergeReport/MergeReportComponents/Borrower';
import { SB168Frozen } from 'libs/models/MergeReport/MergeReportComponents/SB168Frozen';

export class TrueLinkCreditReportType
  extends Homogenize<ITrueLinkCreditReportType>
  implements ITrueLinkCreditReportType
{
  SB168Frozen: ISB168Frozen;
  Borrower: IBorrower;
  Summary: ISummary;
  TradeLinePartition: ITradeLinePartition | ITradeLinePartition[] = [];
  InquiryPartition: IInquiryPartition[] = [];
  BankingRecordPartition: IBankingPartition[] = [];
  PulblicRecordPartition: IPublicPartition[] = [];
  Subscriber: ISubscriber[] = [];
  Message: IMessage[] = [];
  Sources: ISourceSummary[] = [];

  SafetyCheckPassed: boolean | string | null = null;
  DeceasedIndicator: boolean | string | null = null;
  FraudIndicator: boolean | string | null = null;
  CreditVision: boolean | string | null = null;

  constructor(_data: ITrueLinkCreditReportType) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.SB168Frozen = new SB168Frozen(this.SB168Frozen);
    this.Borrower = new Borrower(this.Borrower);
    this.Sources = this.homogenizeArray<ISourceSummary, SourceSummary>(this.Sources, SourceSummary);

    // array maps
    // property maps
  }
}

export class ImportedClass {
  public constructor(something: any) {}
  public async exampleMethod() {
    return 'hey';
  }
}

interface GenericInterface<T> {
  new (_data: any): T;
}

export class Simulator<T extends { exampleMethod(): Promise<string> }> {
  public constructor(private c: GenericInterface<T>) {}
  async work() {
    const instanceTry = new this.c('hello');
    await instanceTry.exampleMethod();
  }
}
const simulator = new Simulator(ImportedClass);
simulator.work();
