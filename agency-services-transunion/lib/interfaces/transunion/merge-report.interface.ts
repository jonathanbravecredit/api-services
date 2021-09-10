/*====================================*/
/* !!Important!!                      */
/* - Keep all spelling mistakes as is */

import { ISource, ICodeRef, IPartitionSet, IPartitionElements, IRemark } from 'lib/interfaces';

/*====================================*/
export interface IMergeReport {
  TrueLinkCreditReportType: ITrueLinkCreditReportType;
}
export interface ITrueLinkCreditReportType {
  SB168Frozen?: string;
  Borrower?: IBorrower | IBorrower[];
  TradeLinePartition?: ITradeLinePartition | ITradeLinePartition[];
  InquiryPartition?: IInquiryPartition | IInquiryPartition[];
  BankingRecordPartition?: IBankingPartition | IBankingPartition[];
  PulblicRecordPartition?: IPublicPartition | IPublicPartition[];
  Subscriber?: ISubscriber | ISubscriber[];
  Message?: IMessage | IMessage[];
  Summary?: ISummary;
  Sources?: { Source?: ISource } | { Source?: ISource }[];
  SafetyCheckPassed?: boolean | string;
  DeceasedIndicator?: boolean | string;
  FraudIndicator?: boolean | string;
  CreditVision?: boolean | string;
}

/*=======================*/
/*    Frozen Elements    */
/*=======================*/
export interface ISB168Frozen {
  equifax?: boolean;
  experian?: boolean;
  transunion?: boolean;
}

/*=======================*/
/*    Borrower Elements  */
/*=======================*/
export interface IBorrower {
  BorrowerAddress?: IBorrowerAddress | IBorrowerAddress[];
  PreviousAddress?: IBorrowerAddress | IBorrowerAddress[];
  Birth?: IBorrowerBirth | IBorrowerBirth[];
  CreditStatement?: ICreditStatement | ICreditStatement[];
  CreditScore?: ICreditScore | ICreditScore[];
  Employer?: IEmployer | IEmployer[];
  BorrowerName?: IBorrowerName | IBorrowerName[];
  BorrowerTelephone?: IBorrowerTelephone | IBorrowerTelephone[];
  SocialPartition?: ISocialPartition | ISocialPartition[];
  BorrowerBureauIdentifier?: IBorrowerBureauIdentifier | IBorrowerBureauIdentifier[];
  borrowerKey?: string;
  SocialSecurityNumber?: string;
}
export interface IBorrowerAddress {
  CreditAddress?: ICreditAddress;
  Dwelling?: ICodeRef;
  Origin?: ICodeRef;
  Ownership?: ICodeRef;
  Source?: ISource;
}
export interface ICreditAddress {
  city?: string;
  country?: string;
  county?: string;
  direction?: string;
  houseNumber?: string;
  postDirection?: string;
  stateCode?: string;
  streetName?: string;
  unit?: string;
  unparsedStreet?: string;
  postalCode?: string;
}
export interface IBorrowerBirth extends IPartitionSet {
  BirthDate?: string;
  Source?: ISource;
  date?: string;
  age?: number;
}
export interface IBorrowerName extends IPartitionElements {
  Name?: IName;
  NameType?: ICodeRef;
  Source?: ISource;
}
export interface IName {
  prefix?: string;
  first?: string;
  middle?: string;
  last?: string;
  suffix?: string;
}
export interface IBorrowerTelephone extends IPartitionElements {
  PhoneNumber?: IPhoneNumber;
  PhoneType?: ICodeRef;
  Source?: ISource;
}
export interface IPhoneNumber {
  AreaCode?: string;
  Number?: string;
  Extension?: string;
}
export interface ICreditStatement {
  StatementType?: ICodeRef;
  Source?: ISource;
  statement?: string;
}
export interface ICreditScore {
  CreditScoreFactor?: ICreditScoreFactor | ICreditScoreFactor[];
  CreditScoreMode?: ICodeRef;
  NoScoreReason?: ICodeRef;
  Source?: ISource;
  qualitativeRank?: number | string;
  inquiriesAffectedScore?: boolean | string;
  new: boolean;
  riskScore: number | string;
  scoreName: string;
  populationRank: number | string;
}
export interface ICreditScoreFactor {
  Factor?: ICodeRef;
  FactorText?: string | string[];
  FactorType?: 'Negative' | 'Positive';
  bureauCode?: number;
}
export interface IEmployer extends IPartitionElements {
  CreditAddress?: ICreditAddress;
  Source?: ISource;
  name?: string;
}
export interface ISocialPartition {
  Social?: ISocial | ISocial[];
}
export interface ISocial {
  SocialSecurityNumber?: string;
  Source?: ISource;
}
export interface IBorrowerBureauIdentifier extends IPartitionSet {
  type?: string;
  identifier?: string;
  Source?: ISource;
}

/*=======================*/
/*   Tradeline Elements  */
/*=======================*/
export interface ITradeLinePartition {
  Tradeline?: ITradeline;
  accountTypeDescription?: string;
  accountTypeSymbol?: string;
  accountTypeAbbreviation?: string;
}
export interface ITradeline {
  AccountCondition?: ICodeRef;
  AccountDesignator?: ICodeRef;
  DisputeFlag?: ICodeRef;
  IndustryCode?: ICodeRef;
  OpenClosed?: ICodeRef;
  PayStatus?: ICodeRef;
  VerificationIndicator?: ICodeRef;
  Remark?: IRemark | IRemark[];
  WatchTrade: IWatchTrade;
  GrantedTrade: IGrantedTrade;
  CollectionTrade?: ICollectionTrade;
  Source?: ISource;
  subscriberCode?: string;
  highBalance?: number | string;
  dateVerified?: string;
  handle?: string;
  bureau?: string;
  position?: number | string;
  dateReported?: string;
  currentBalance?: number | string;
  creditorName?: string;
  accountNumber?: string;
  dateOpened?: string;
  dateClosed?: string;
  dateAccountStatus?: string;
}
export interface IWatchTrade {
  ContactMethod?: ICodeRef;
  CreditType?: ICodeRef;
  PreviousAccountCondition?: ICodeRef;
  previousAmountPastDue?: number | string;
  amountPastDue?: number | string;
}
export interface ICollectionTrade {
  creditType?: ICodeRef;
  actualPaymentAmount?: number | string;
  originalCreditor?: string;
}
export interface IGrantedTrade {
  AccountType?: ICodeRef;
  CreditType?: ICodeRef;
  PaymentFrequency?: ICodeRef;
  TermType?: ICodeRef;
  WorstPayStatus?: ICodeRef;
  PayStatusHistory?: IPayStatusHistory;
  CreditLimit?: number | string;
  monthsReviewed?: number | string;
  monthlyPayment?: number | string;
  late90Count?: number | string;
  late60Count?: number | string;
  late30Count?: number | string;
  actualPaymentAmount?: number | string;
  worstPatStatusCount?: number | string;
  termMonths?: number | string;
  dateLastPayment?: string;
  collateral?: string;
  amountPastDue?: number | string;
  dateWorstPayStatus?: string;
  datePastDue?: string;
}
export interface IPayStatusHistory {
  MonthlyPayStatus?: IMonthyPayStatusItem | IMonthyPayStatusItem[];
  startDate?: string;
  status?: string;
}
export interface IMonthyPayStatusItem {
  GenericRemark?: ICodeRef;
  RatingRemark?: ICodeRef;
  ComplianceRemark?: ICodeRef;
  PaymentDue?: number | string;
  CreditLimit?: number | string;
  ActualPayment?: number | string;
  PastDue?: number | string;
  highCredit?: number | string;
  status?: string;
  date?: string;
  currentBalance?: number | string;
  changed?: boolean | string;
}

/*=======================*/
/*   Inquiry Elements    */
/*=======================*/
export interface IInquiryPartition {
  Inquiry?: IInquiry | IInquiry[];
}
export interface IInquiry {
  IndustryCode?: ICodeRef;
  Source?: ISource;
  bureau?: string;
  inquiryType?: string;
  subscriberNumber?: string;
  inquiryDate?: string;
  subscriberName?: string;
}

/*=======================*/
/*   Banking Elements    */
/*=======================*/
export interface IBankingPartition {
  BankingRecord?: IBankingRecord | IBankingRecord[];
}
export interface IBankingRecord {
  BankingType?: ICodeRef;
  AccountDesignator?: ICodeRef;
  IndustryCode?: ICodeRef;
  Status?: ICodeRef;
  Remark?: IRemark | IRemark[];
  Source?: ISource;
  dateOpened?: string;
  dateClosed?: string;
  bureau?: string;
  dateVerified?: string;
  subscriberCode?: string;
  bankName?: string;
  balance?: number | string;
  accountNumber?: string;
}

/*=======================*/
/*    Public Elements    */
/*=======================*/
export interface IPublicPartition {
  PublicRecord?: IPublicRecord;
}
export interface IPublicRecord {
  AccountDesignator?: ICodeRef;
  Classification?: ICodeRef;
  IndustryCode?: ICodeRef;
  Status?: ICodeRef;
  Type?: ICodeRef;
  ExpirationDate?: string;
  MiscPublicRecord?: IMiscPublicRecord;
  FinancingStatement?: IFinancingStatement;
  Garnishment?: IGarnishment;
  FinancialCounseling?: IFinancialCounseling;
  MaritalItem?: IMaritalItem;
  Bankruptcy?: IBankruptcy;
  RegisteredItem?: IRegisteredItem;
  TaxLien?: ITaxLien;
  LegalItem?: ILegalItem;
  Foreclosure?: IForeclosure;
  Remark?: IRemark | IRemark[];
  Source?: ISource;
  subscriberCode?: string;
  referenceNumber?: string;
  handle?: string;
  bureau?: string;
  dateFiled?: string;
  courtName?: string;
  dateVerified?: string;
  dateUpdated?: string;
}
export interface IMiscPublicRecord {
  miscInformation?: string;
}
export interface IFinancingStatement {
  CreditorType?: ICodeRef;
  dateMaturity?: string;
}
export interface IGarnishment {
  amount?: number | string;
  dateSatisfied?: string;
  garnishee?: string;
  plaintiff?: string;
}
export interface IFinancialCounseling {
  amount?: number | string;
  dateChecked?: string;
  dateSettled?: string;
}
export interface IMaritalItem {
  spouse?: string;
}
export interface IBankruptcy {
  courtNumber?: string;
  division?: string;
  assetAmount?: number | string;
  dateResolved?: string;
  exemptAmount?: number | string;
  liabilityAmount?: number | string;
  trustee?: string;
  company?: string;
  thirdParty?: string;
}
export interface IRegisteredItem {
  Security?: ICodeRef | ICodeRef[];
  originalBalance?: number | string;
  dateMatures?: string;
}
export interface ITaxLien {
  amount?: number | string;
  dateReleased?: string;
}
export interface ILegalItem {
  CourtLocation?: ICodeRef;
  CourtType?: ICodeRef;
  plaintiff?: string;
  lawyer?: string;
  thirdParty?: string;
  actionAmount?: number | string;
  balance?: number | string;
  dateSatisfied?: string;
}
export interface IForeclosure {
  dateSettled?: string;
  liability?: number | string;
}

/*=======================*/
/*  Subscriber Elements  */
/*=======================*/
export interface ISubscriber {
  CreditAddress?: ICreditAddress;
  IndustryCode?: ICodeRef;
  Source?: ISource;
  subscriberCode?: string;
  telephone?: string;
  name?: string;
}

/*=======================*/
/*    Message Elements   */
/*=======================*/
export interface IMessage {
  Code: ICodeRef;
  Type: ICodeRef;
}

/*=======================*/
/*   Summary Elements    */
/*=======================*/
export interface ISummary {
  TradelineSummary?: ITradelineSummary;
  InquirySummary?: IInquirySummary;
  PublicRecordSummary?: IPublicRecordSummary;
  PortfolioCreditSummary?: IPortfolioCreditSummary | IPortfolioCreditSummary[];
  AccountHistorySummary?: IAccountHistorySummary | IAccountHistorySummary[];
}
export interface ITradelineSummary {
  Experian?: ITradelineSummaryInfo;
  Equifax?: ITradelineSummaryInfo;
  Transunion?: ITradelineSummaryInfo;
  Merge?: ITradelineSummaryInfo;
}
export interface ITradelineSummaryInfo {
  RecentDeliquencyMOP?: ICodeRef;
  TotalHistoricalNegatives?: number | string;
  TotalCollectionAccounts?: number | string;
  HistoricalNegativeAccounts?: number | string;
  TotalInstallmentAccounts?: number | string;
  OpenInstallmentAccounts?: number | string;
  TotalOtherAccounts?: number | string;
  OpenOtherAccounts?: number | string;
  OpenMortgageAccounts?: number | string;
  RecentDeliquencyDate?: string;
  TotalMortgageAccounts?: number | string;
  DelinquentAccounts?: number | string;
  DerogatoryAccounts?: number | string;
  CloseAccounts?: number | string;
  TotalAccounts?: number | string;
  OpenAccounts?: number | string;
  TotalRevolvingAccounts?: number | string;
  OpenRevolvingAccounts?: number | string;
  CreditSummaryPeriod?: string;
  TotalBalances?: number | string;
  TotalMonthlyPayments?: number | string;
}
export interface IInquirySummary {
  Experian?: IInquirySummaryInfo;
  Equifax?: IInquirySummaryInfo;
  Transunion?: IInquirySummaryInfo;
  Merge?: IInquirySummaryInfo;
}
export interface IInquirySummaryInfo {
  NumberInLast2Years?: number | string;
}
export interface IPublicRecordSummary {
  Experian?: IPublicRecordSummaryInfo;
  Equifax?: IPublicRecordSummaryInfo;
  Transunion?: IPublicRecordSummaryInfo;
  Merge?: IPublicRecordSummaryInfo;
}
export interface IPublicRecordSummaryInfo {
  NumberOfRecords?: number | string;
}
export interface IPortfolioCreditSummary {
  Transunion?: IPortfolioCreditSummaryInfo;
}
export interface IPortfolioCreditSummaryInfo {
  SummaryType?: ICodeRef;
  CurrentPaymentDueAmount?: number | string;
  PriorPaymentDueAmount?: number | string;
  CurrentActualPaymentAmount?: number | string;
  PastDueAmount?: number | string;
  CreditLimitAmount?: number | string;
  BalanceAmount?: number | string;
}
export interface IAccountHistorySummary {
  Transunion?: IAccountHistorySummaryInfo;
}
export interface IAccountHistorySummaryInfo {
  SummaryType?: ICodeRef;
  TotalPaymentRatio?: number | string;
  ActualPaymentAmount?: number | string;
  PaymentDueAmount?: number | string;
  TransactorRevolverIndicator?: string;
  EndingBalanceAmount?: number | string;
  AggregateExcessPaymentAmount?: number | string;
  ActiveAccounts?: number | string;
  OpenAccounts?: number | string;
  TimePeriod?: string;
  EstimatedSpendAmount?: number | string;
  PriorMonthBalance?: number | string;
  CreditLimitAmount?: number | string;
}

export interface IUnparsedCreditReport {
  '#text': string;
  type: string;
}

// export interface ISummary {
//   TradelineSummary?: {
//     TransUnion?: string;
//   };
//   InquirySummary?: {
//     TransUnion?: string;
//   };
//   PublicRecordSummary?: {
//     TransUnion?: string;
//   };
//   Sources?: {
//     Source?: {
//       Bureau?: string;
//       InquiryDate?: string;
//       OriginalData?: string;
//     };
//   };
//   SafetyCheckPassed?: string;
// }
