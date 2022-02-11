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
import { Message } from 'libs/models/MergeReport/MergeReportComponents/Message';
import { PublicPartition } from 'libs/models/MergeReport/MergeReportComponents/PublicPartition';
import { SB168Frozen } from 'libs/models/MergeReport/MergeReportComponents/SB168Frozen';
import { Subscriber } from 'libs/models/MergeReport/MergeReportComponents/Subscriber';
import { Summary } from 'libs/models/MergeReport/MergeReportComponents/Summary';
import { TradeLinePartition } from 'libs/models/MergeReport/MergeReportComponents/TradeLinePartition';

export class TrueLinkCreditReportType
  extends Homogenize<ITrueLinkCreditReportType>
  implements ITrueLinkCreditReportType
{
  SB168Frozen: ISB168Frozen;
  Borrower: IBorrower;
  TradeLinePartition: ITradeLinePartition | ITradeLinePartition[] = [];
  InquiryPartition: IInquiryPartition[] = [];
  BankingRecordPartition: IBankingPartition[] = [];
  PulblicRecordPartition: IPublicPartition[] = [];
  Subscriber: ISubscriber[] = [];
  Message: IMessage[] = [];
  Summary: ISummary;
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
    this.PulblicRecordPartition = this.homogenizeArray<IPublicPartition, PublicPartition>(
      this.PulblicRecordPartition,
      PublicPartition,
    );
    this.Subscriber = this.homogenizeArray<ISubscriber, Subscriber>(this.Subscriber, Subscriber);
    this.Message = this.homogenizeArray<IMessage, Message>(this.Message, Message);
    this.Summary = new Summary(this.Summary);
    this.Sources = this.homogenizeArray<ISourceSummary, SourceSummary>(this.Sources, SourceSummary);
  }
}
