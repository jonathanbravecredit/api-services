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
import { BankingPartition } from 'libs/models/MergeReport/MergeReportComponents/BankingPartition';
import { Borrower } from 'libs/models/MergeReport/MergeReportComponents/Borrower';
import { InquiryPartition } from 'libs/models/MergeReport/MergeReportComponents/InquiryPartition';
import { SB168Frozen } from 'libs/models/MergeReport/MergeReportComponents/SB168Frozen';
import { TradeLinePartition } from 'libs/models/MergeReport/MergeReportComponents/TradeLinePartition';

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
    this.TradeLinePartition = this.homogenizeArray<ITradeLinePartition, TradeLinePartition>(
      this.TradeLinePartition,
      TradeLinePartition,
    );
    this.InquiryPartition = this.homogenizeArray<IInquiryPartition, InquiryPartition>(
      this.InquiryPartition,
      InquiryPartition,
    );
    this.BankingRecordPartition = this.homogenizeArray<IBankingPartition, BankingPartition>(
      this.BankingRecordPartition,
      BankingPartition,
    );

    // array maps
    // property maps
  }
}
