/*====================================*/
/* !!Important!!                      */
/* - Keep all spelling mistakes as is */

import {
  ISource,
  ICodeRef,
  IPartitionSet,
  IPartitionElements,
  IRemark,
  IDate,
  ISourceSummary,
} from 'libs/interfaces/common.interface';

/*====================================*/
export interface IMergeReport {
  TrueLinkCreditReportType: ITrueLinkCreditReportType;
}

export interface ITrueLinkCreditReportType {
  SB168Frozen: ISB168Frozen;
  Borrower: IBorrower;
  TradeLinePartition: ITradeLinePartition[];
  InquiryPartition: IInquiryPartition[];
  BankingRecordPartition: IBankingPartition[];
  PulblicRecordPartition: IPublicPartition[];
  Subscriber: ISubscriber[];
  Message: IMessage[];
  Summary: ISummary;
  Sources: ISourceSummary[];
  SafetyCheckPassed: boolean | string | null;
  DeceasedIndicator: boolean | string | null;
  FraudIndicator: boolean | string | null;
  CreditVision: boolean | string | null;
}

/*=======================*/
/*    Frozen Elements    */
/*=======================*/
export interface ISB168Frozen {
  equifax: boolean | null;
  experian: boolean | null;
  transunion: boolean | null;
}

/*=======================*/
/*    Borrower Elements  */
/*=======================*/
export interface IBorrower {
  BorrowerAddress: IBorrowerAddress[];
  PreviousAddress: IBorrowerAddress[];
  Birth: IBorrowerBirth[];
  CreditStatement: ICreditStatement[];
  CreditScore: ICreditScore[];
  Employer: IEmployer[];
  BorrowerName: IBorrowerName[];
  BorrowerTelephone: IBorrowerTelephone[];
  SocialPartition: ISocialPartition[];
  BorrowerBureauIdentifier: IBorrowerBureauIdentifier[];
  borrowerKey: string | null;
  SocialSecurityNumber: string | number | null;
}
export interface IBorrowerAddress {
  CreditAddress: ICreditAddress;
  Dwelling: ICodeRef;
  Origin: ICodeRef;
  Ownership: ICodeRef;
  Source: ISource;
  dateReported: string | null;
  addressOrder: number | null;
  partitionSet: number | null;
}
export interface ICreditAddress {
  city: string | null;
  country: string | null;
  county: string | null;
  direction: string | null;
  houseNumber: string | number | null;
  postDirection: string | null;
  stateCode: string | null;
  streetName: string | null;
  unit: string | number | null;
  unparsedStreet: string | null;
  postalCode: string | number | null;
}
export interface IBorrowerBirth extends IPartitionSet {
  BirthDate: IDate;
  Source: ISource;
  date: string | null;
  age: number | null;
}
export interface IBorrowerName extends IPartitionElements {
  Name: IName;
  NameType: ICodeRef;
  Source: ISource;
}
export interface IName {
  prefix: string | null;
  first: string | null;
  middle: string | null;
  last: string | null;
  suffix: string | null;
}
export interface IBorrowerTelephone extends IPartitionElements {
  PhoneNumber: IPhoneNumber;
  PhoneType: ICodeRef;
  Source: ISource;
}
export interface IPhoneNumber {
  AreaCode: string | null;
  Number: string | null;
  Extension: string | null;
}
export interface ICreditStatement {
  StatementType: ICodeRef;
  Source: ISource;
  statement: string | null;
}
export interface ICreditScore {
  CreditScoreFactor: ICreditScoreFactor | ICreditScoreFactor[];
  CreditScoreMode: ICodeRef;
  NoScoreReason: ICodeRef;
  Source: ISource;
  qualitativeRank: number | string | null;
  inquiriesAffectedScore: boolean | string | null;
  new: boolean | null;
  riskScore: number | string | null;
  scoreName: string | null;
  populationRank: number | string | null;
}
export interface ICreditScoreFactor {
  Factor: ICodeRef;
  FactorText: string[];
  FactorType: 'Negative' | 'Positive';
  bureauCode: number | null;
}
export interface IEmployer extends IPartitionElements {
  CreditAddress: ICreditAddress;
  Source: ISource;
  name: string | null;
}
export interface ISocialPartition {
  Social: ISocial[];
}
export interface ISocial {
  SocialSecurityNumber: string | null;
  Source: ISource;
}
export interface IBorrowerBureauIdentifier extends IPartitionSet {
  type: string | null;
  identifier: string | null;
  Source: ISource;
}

/*=======================*/
/*   Tradeline Elements  */
/*=======================*/
export interface ITradeLinePartition {
  Tradeline: ITradeline;
  accountTypeDescription: string | null;
  accountTypeSymbol: string | null;
  accountTypeAbbreviation: string | null;
}
export interface ITradeline {
  AccountCondition: ICodeRef;
  AccountDesignator: ICodeRef;
  DisputeFlag: ICodeRef;
  IndustryCode: ICodeRef;
  OpenClosed: ICodeRef;
  PayStatus: ICodeRef;
  VerificationIndicator: ICodeRef;
  Remark: IRemark[];
  WatchTrade: IWatchTrade;
  GrantedTrade: IGrantedTrade;
  CollectionTrade: ICollectionTrade;
  Source: ISource;
  subscriberCode: string | null;
  highBalance: number | string | null;
  dateVerified: string | null;
  handle: string | null;
  bureau: string | null;
  position: number | string | null;
  dateReported: string | null;
  currentBalance: number | string | null;
  creditorName: string | null;
  accountNumber: string | number | null;
  dateOpened: string | null;
  dateClosed: string | null;
  dateAccountStatus: string | null;
}
export interface IWatchTrade {
  ContactMethod: ICodeRef;
  CreditType: ICodeRef;
  PreviousAccountCondition: ICodeRef;
  previousAmountPastDue: number | string | null;
  amountPastDue: number | string | null;
}
export interface ICollectionTrade {
  creditType: ICodeRef;
  actualPaymentAmount: number | string | null;
  originalCreditor: string | null;
}
export interface IGrantedTrade {
  AccountType: ICodeRef;
  CreditType: ICodeRef;
  PaymentFrequency: ICodeRef;
  TermType: ICodeRef;
  WorstPayStatus: ICodeRef;
  PayStatusHistory: IPayStatusHistory;
  CreditLimit: number | string | null;
  monthsReviewed: number | string | null;
  monthlyPayment: number | string | null;
  late90Count: number | string | null;
  late60Count: number | string | null;
  late30Count: number | string | null;
  actualPaymentAmount: number | string | null;
  worstPatStatusCount: number | string | null;
  termMonths: number | string | null;
  dateLastPayment: string | null;
  collateral: string | null;
  amountPastDue: number | string | null;
  dateWorstPayStatus: string | null;
  datePastDue: string | null;
}
export interface IPayStatusHistory {
  MonthlyPayStatus: IMonthyPayStatusItem[];
  startDate: string | null;
  status: string | null;
}
export interface IMonthyPayStatusItem {
  GenericRemark: ICodeRef;
  RatingRemark: ICodeRef;
  ComplianceRemark: ICodeRef;
  PaymentDue: number | string | null;
  CreditLimit: number | string | null;
  ActualPayment: number | string | null;
  PastDue: number | string | null;
  highCredit: number | string | null;
  status: string | null;
  date: string | null;
  currentBalance: number | string | null;
  changed: boolean | string | null;
}

/*=======================*/
/*   Inquiry Elements    */
/*=======================*/
export interface IInquiryPartition {
  Inquiry: IInquiry;
}
export interface IInquiry {
  IndustryCode: ICodeRef;
  Source: ISource;
  bureau: string | null;
  inquiryType: string | null;
  subscriberNumber: string | null;
  inquiryDate: string | null;
  subscriberName: string | null;
}

/*=======================*/
/*   Banking Elements    */
/*=======================*/
export interface IBankingPartition {
  BankingRecord: IBankingRecord[];
}
export interface IBankingRecord {
  BankingType: ICodeRef;
  AccountDesignator: ICodeRef;
  IndustryCode: ICodeRef;
  Status: ICodeRef;
  Remark: IRemark[];
  Source: ISource;
  dateOpened: string | null;
  dateClosed: string | null;
  bureau: string | null;
  dateVerified: string | null;
  subscriberCode: string | null;
  bankName: string | null;
  balance: number | string | null;
  accountNumber: string | null;
}

/*=======================*/
/*    Public Elements    */
/*=======================*/
export interface IPublicPartition {
  PublicRecord: IPublicRecord;
}
export interface IPublicRecord {
  AccountDesignator: ICodeRef;
  Classification: ICodeRef;
  IndustryCode: ICodeRef;
  Status: ICodeRef;
  Type: ICodeRef;
  ExpirationDate: string | null;
  MiscPublicRecord: IMiscPublicRecord;
  FinancingStatement: IFinancingStatement;
  Garnishment: IGarnishment;
  FinancialCounseling: IFinancialCounseling;
  MaritalItem: IMaritalItem;
  Bankruptcy: IBankruptcy;
  RegisteredItem: IRegisteredItem;
  TaxLien: ITaxLien;
  LegalItem: ILegalItem;
  Foreclosure: IForeclosure;
  Remark: IRemark[];
  Source: ISource;
  subscriberCode: string | null;
  referenceNumber: string | null;
  handle: string | null;
  bureau: string | null;
  dateFiled: string | null;
  courtName: string | null;
  dateVerified: string | null;
  dateUpdated: string | null;
}
export interface IMiscPublicRecord {
  miscInformation: string | null;
}
export interface IFinancingStatement {
  CreditorType: ICodeRef;
  dateMaturity: string | null;
}
export interface IGarnishment {
  amount: number | string | null;
  dateSatisfied: string | null;
  garnishee: string | null;
  plaintiff: string | null;
}
export interface IFinancialCounseling {
  amount: number | string | null;
  dateChecked: string | null;
  dateSettled: string | null;
}
export interface IMaritalItem {
  spouse: string | null;
}
export interface IBankruptcy {
  courtNumber: string | null;
  division: string | null;
  assetAmount: number | string | null;
  dateResolved: string | null;
  exemptAmount: number | string | null;
  liabilityAmount: number | string | null;
  trustee: string | null;
  company: string | null;
  thirdParty: string | null;
}
export interface IRegisteredItem {
  Security: ICodeRef[];
  originalBalance: number | string | null;
  dateMatures: string | null;
}
export interface ITaxLien {
  amount: number | string | null;
  dateReleased: string | null;
}
export interface ILegalItem {
  CourtLocation: ICodeRef;
  CourtType: ICodeRef;
  plaintiff: string | null;
  lawyer: string | null;
  thirdParty: string | null;
  actionAmount: number | string | null;
  balance: number | string | null;
  dateSatisfied: string | null;
}
export interface IForeclosure {
  dateSettled: string | null;
  liability: number | string | null;
}

/*=======================*/
/*  Subscriber Elements  */
/*=======================*/
export interface ISubscriber {
  CreditAddress: ICreditAddress;
  IndustryCode: ICodeRef;
  Source: ISource;
  subscriberCode: string | null;
  telephone: string | null;
  name: string | null;
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
  TradelineSummary: ITradelineSummary;
  InquirySummary: IInquirySummary;
  PublicRecordSummary: IPublicRecordSummary;
  PortfolioCreditSummary: IPortfolioCreditSummary[];
  AccountHistorySummary: IAccountHistorySummary[];
}
export interface ITradelineSummary {
  Experian: ITradelineSummaryInfo;
  Equifax: ITradelineSummaryInfo;
  TransUnion: ITradelineSummaryInfo;
  Merge: ITradelineSummaryInfo;
}
export interface ITradelineSummaryInfo {
  RecentDeliquencyMOP: ICodeRef;
  TotalHistoricalNegatives: number | string | null;
  OpenCollectionAccounts: number | string | null;
  TotalCollectionAccounts: number | string | null;
  HistoricalNegativeAccounts: number | string | null;
  TotalInstallmentAccounts: number | string | null;
  OpenInstallmentAccounts: number | string | null;
  TotalOtherAccounts: number | string | null;
  OpenOtherAccounts: number | string | null;
  OpenMortgageAccounts: number | string | null;
  RecentDeliquencyDate: string | null;
  TotalMortgageAccounts: number | string | null;
  DelinquentAccounts: number | string | null;
  DerogatoryAccounts: number | string | null;
  CloseAccounts: number | string | null;
  TotalAccounts: number | string | null;
  OpenAccounts: number | string | null;
  TotalRevolvingAccounts: number | string | null;
  OpenRevolvingAccounts: number | string | null;
  CreditSummaryPeriod: string | null;
  TotalBalances: number | string | null;
  TotalMonthlyPayments: number | string | null;
  AgeofCredit: number | string | null;
}
export interface IInquirySummary {
  Experian: IInquirySummaryInfo;
  Equifax: IInquirySummaryInfo;
  Transunion: IInquirySummaryInfo;
  Merge: IInquirySummaryInfo;
}
export interface IInquirySummaryInfo {
  NumberInLast2Years: number | string | null;
}
export interface IPublicRecordSummary {
  Experian: IPublicRecordSummaryInfo;
  Equifax: IPublicRecordSummaryInfo;
  Transunion: IPublicRecordSummaryInfo;
  Merge: IPublicRecordSummaryInfo;
}
export interface IPublicRecordSummaryInfo {
  NumberOfRecords: number | string | null;
}
export interface IPortfolioCreditSummary {
  Transunion: IPortfolioCreditSummaryInfo;
}
export interface IPortfolioCreditSummaryInfo {
  SummaryType: ICodeRef;
  CurrentPaymentDueAmount: number | string | null;
  PriorPaymentDueAmount: number | string | null;
  CurrentActualPaymentAmount: number | string | null;
  PastDueAmount: number | string | null;
  CreditLimitAmount: number | string | null;
  BalanceAmount: number | string | null;
}
export interface IAccountHistorySummary {
  Transunion: IAccountHistorySummaryInfo;
}
export interface IAccountHistorySummaryInfo {
  SummaryType: ICodeRef;
  TotalPaymentRatio: number | string | null;
  ActualPaymentAmount: number | string | null;
  PaymentDueAmount: number | string | null;
  TransactorRevolverIndicator: string | null;
  EndingBalanceAmount: number | string | null;
  AggregateExcessPaymentAmount: number | string | null;
  ActiveAccounts: number | string | null;
  OpenAccounts: number | string | null;
  TimePeriod: string | null;
  EstimatedSpendAmount: number | string | null;
  PriorMonthBalance: number | string | null;
  CreditLimitAmount: number | string | null;
}

export interface IUnparsedCreditReport {
  '#text': string | null;
  type: string | null;
}
