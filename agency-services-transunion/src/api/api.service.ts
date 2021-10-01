/*======= copied over from app =======*/

export type Transunion = {
  __typename: "Transunion";
  authenticated?: boolean | null;
  indicativeEnrichmentSuccess?: boolean | null;
  indicativeEnrichmentStatus?: TUStatusRef;
  getAuthenticationQuestionsSuccess?: boolean | null;
  getAuthenticationQuestionsStatus?: TUStatusRef;
  verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
  verifyAuthenticationQuestionsOTPStatus?: TUStatusRef;
  verifyAuthenticationQuestionsKBASuccess?: boolean | null;
  verifyAuthenticationQuestionsKBAStatus?: TUStatusRef;
  serviceBundleFulfillmentKey?: string | null;
  currentRawQuestions?: string | null;
  currentRawAuthDetails?: string | null;
  authAttempt?: number | null;
  pinRequests?: number | null;
  pinAttempts?: number | null;
  pinCurrentAge?: number | null;
  kbaAttempts?: number | null;
  kbaCurrentAge?: number | null;
  enrollmentKey?: string | null;
  enrollReport?: TUReportResponse;
  enrollMergeReport?: TUReportResponse;
  enrollVantageScore?: TUReportResponse;
  enrolled?: boolean | null;
  enrolledOn?: string | null;
  fulfillReport?: TUReportResponse;
  fulfillMergeReport?: TUReportResponse;
  fulfillVantageScore?: TUReportResponse;
  fulfilledOn?: string | null;
  acknowledgedDisputeTerms?: boolean | null;
  acknowledgedDisputeTermsOn?: string | null;
  disputeServiceBundleFulfillmentKey?: string | null;
  disputeEnrollmentKey?: string | null;
  disputeEnrolled?: boolean | null;
  disputeEnrolledOn?: string | null;
  disputeStatus?: string | null;
  disputes?: Array<Dispute | null> | null;
};

export type TUStatusRef = {
  __typename: "TUStatusRef";
  id?: string | null;
  status?: string | null;
  statusDescription?: string | null;
  statusModifiedOn?: string | null;
  statusCode?: string | null;
};

export type TUReportResponse = {
  __typename: "TUReportResponse";
  bureau?: string | null;
  errorResponse?: string | null;
  serviceProduct?: string | null;
  serviceProductFullfillmentKey?: string | null;
  serviceProductObject?: string | null;
  serviceProductTypeId?: string | null;
  serviceProductValue?: string | null;
  status?: string | null;
};

export type Dispute = {
  __typename: "Dispute";
  id?: string;
  appDataId?: string;
  disputeId?: string | null;
  disputeStatus?: string | null;
  disputeLetterCode?: string | null;
  disputeLetterContent?: string | null;
  openDisputes?: DisputeSummary;
  closedDisputes?: DisputeSummary;
  pvDisputedItems?: PVDisputedItems;
  agencyName?: string | null;
  openedOn?: string | null;
  closedOn?: string | null;
  disputeItems?: string | null;
  disputeInvestigationResults?: string | null;
  disputeCreditBureau?: string | null;
  notificationStatus?: string | null;
  notificationMessage?: string | null;
  notificationSentOn?: string | null;
};

export type DisputeSummary = {
  __typename: "DisputeSummary";
  estimatedCompletionDate?: string | null;
  lastUpdatedDate?: string | null;
  openDate?: string | null;
  requestedDate?: string | null;
  totalClosedDisputedItems?: string | null;
  totalDisputedItems?: string | null;
  totalOpenDisputedItems?: string | null;
  totalPVDisputedItemCount?: string | null;
};

export type PVDisputedItems = {
  __typename: "PVDisputedItems";
  pvTradelines?: string | null;
  pvPublicRecords?: string | null;
};

export type CreateAppDataInput = {
  id?: string | null;
  user: UserInput;
  agencies: AgenciesInput;
  preferences: PreferencesInput;
  status?: string | null;
  statusReason?: string | null;
  statusReasonDescription?: string | null;
  lastStatusModifiedOn?: string | null;
  nextStatusModifiedOn?: string | null;
};

export type UserInput = {
  id: string;
  userAttributes?: UserAttributesInput | null;
  onboarding?: OnboardingInput | null;
};

export type UserAttributesInput = {
  name?: NameInput | null;
  address?: AddressInput | null;
  phone?: PhoneInput | null;
  dob?: DobInput | null;
  ssn?: SsnInput | null;
};

export type NameInput = {
  first: string;
  middle?: string | null;
  last: string;
};

export type AddressInput = {
  addressOne: string;
  addressTwo?: string | null;
  city: string;
  state: string;
  zip: string;
};

export type PhoneInput = {
  primary: string;
};

export type DobInput = {
  year: string;
  month: string;
  day: string;
};

export type SsnInput = {
  lastfour: string;
  full?: string | null;
};

export type OnboardingInput = {
  lastActive: number;
  lastComplete: number;
  started?: boolean | null;
  abandoned?: boolean | null;
  display?: Array<OnboardingStepInput | null> | null;
};

export type OnboardingStepInput = {
  id?: number | null;
  active?: boolean | null;
  complete?: boolean | null;
  abandoned?: boolean | null;
  name?: string | null;
};

export type AgenciesInput = {
  transunion?: TransunionInput | null;
  equifax?: EquifaxInput | null;
  experian?: ExperianInput | null;
};

export type TransunionInput = {
  authenticated?: boolean | null;
  indicativeEnrichmentSuccess?: boolean | null;
  indicativeEnrichmentStatus?: TUStatusRefInput | null;
  getAuthenticationQuestionsSuccess?: boolean | null;
  getAuthenticationQuestionsStatus?: TUStatusRefInput | null;
  verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
  verifyAuthenticationQuestionsOTPStatus?: TUStatusRefInput | null;
  verifyAuthenticationQuestionsKBASuccess?: boolean | null;
  verifyAuthenticationQuestionsKBAStatus?: TUStatusRefInput | null;
  serviceBundleFulfillmentKey?: string | null;
  currentRawQuestions?: string | null;
  currentRawAuthDetails?: string | null;
  authAttempt?: number | null;
  pinRequests?: number | null;
  pinAttempts?: number | null;
  pinCurrentAge?: number | null;
  kbaAttempts?: number | null;
  kbaCurrentAge?: number | null;
  enrollmentKey?: string | null;
  enrollReport?: TUReportResponseInput | null;
  enrollMergeReport?: TUReportResponseInput | null;
  enrollVantageScore?: TUReportResponseInput | null;
  enrolled?: boolean | null;
  enrolledOn?: string | null;
  fulfillReport?: TUReportResponseInput | null;
  fulfillMergeReport?: TUReportResponseInput | null;
  fulfillVantageScore?: TUReportResponseInput | null;
  fulfilledOn?: string | null;
  acknowledgedDisputeTerms?: boolean | null;
  acknowledgedDisputeTermsOn?: string | null;
  disputeServiceBundleFulfillmentKey?: string | null;
  disputeEnrollmentKey?: string | null;
  disputeEnrolled?: boolean | null;
  disputeEnrolledOn?: string | null;
  disputeStatus?: string | null;
  disputes?: Array<DisputeInput | null> | null;
};

export type TUStatusRefInput = {
  id?: string | null;
  status?: string | null;
  statusDescription?: string | null;
  statusModifiedOn?: string | null;
  statusCode?: string | null;
};

export type TUReportResponseInput = {
  bureau?: string | null;
  errorResponse?: string | null;
  serviceProduct?: string | null;
  serviceProductFullfillmentKey?: string | null;
  serviceProductObject?: string | null;
  serviceProductTypeId?: string | null;
  serviceProductValue?: string | null;
  status?: string | null;
};

export type DisputeInput = {
  id: string;
  appDataId: string;
  disputeId?: string | null;
  disputeStatus?: string | null;
  disputeLetterCode?: string | null;
  disputeLetterContent?: string | null;
  openDisputes?: DisputeSummaryInput | null;
  closedDisputes?: DisputeSummaryInput | null;
  pvDisputedItems?: PVDisputedItemsInput | null;
  agencyName?: string | null;
  openedOn?: string | null;
  closedOn?: string | null;
  disputeItems?: string | null;
  disputeInvestigationResults?: string | null;
  disputeCreditBureau?: string | null;
  notificationStatus?: string | null;
  notificationMessage?: string | null;
  notificationSentOn?: string | null;
};

export type DisputeSummaryInput = {
  estimatedCompletionDate?: string | null;
  lastUpdatedDate?: string | null;
  openDate?: string | null;
  requestedDate?: string | null;
  totalClosedDisputedItems?: string | null;
  totalDisputedItems?: string | null;
  totalOpenDisputedItems?: string | null;
  totalPVDisputedItemCount?: string | null;
};

export type PVDisputedItemsInput = {
  pvTradelines?: string | null;
  pvPublicRecords?: string | null;
};

export type EquifaxInput = {
  authenticated?: boolean | null;
};

export type ExperianInput = {
  authenticated?: boolean | null;
};

export type PreferencesInput = {
  showAllAccounts?: ShowAccountsPreferenceInput | null;
};

export type ShowAccountsPreferenceInput = {
  creditCards?: boolean | null;
  collectionsAccounts?: boolean | null;
  installmentLoans?: boolean | null;
  mortgages?: boolean | null;
};

export type ModelAppDataConditionInput = {
  status?: ModelStringInput | null;
  statusReason?: ModelStringInput | null;
  statusReasonDescription?: ModelStringInput | null;
  lastStatusModifiedOn?: ModelStringInput | null;
  nextStatusModifiedOn?: ModelStringInput | null;
  and?: Array<ModelAppDataConditionInput | null> | null;
  or?: Array<ModelAppDataConditionInput | null> | null;
  not?: ModelAppDataConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  Binary = "binary",
  BinarySet = "binarySet",
  Bool = "bool",
  List = "list",
  Map = "map",
  Number = "number",
  NumberSet = "numberSet",
  String = "string",
  StringSet = "stringSet",
  _null = "_null"
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type AppData = {
  __typename: "AppData";
  id?: string;
  user?: User;
  agencies?: Agencies;
  preferences?: Preferences;
  status?: string | null;
  statusReason?: string | null;
  statusReasonDescription?: string | null;
  lastStatusModifiedOn?: string | null;
  nextStatusModifiedOn?: string | null;
  createdAt?: string;
  updatedAt?: string;
  owner?: string | null;
};

export type User = {
  __typename: "User";
  id?: string;
  userAttributes?: UserAttributes;
  onboarding?: Onboarding;
};

export type UserAttributes = {
  __typename: "UserAttributes";
  name?: Name;
  address?: Address;
  phone?: Phone;
  dob?: Dob;
  ssn?: Ssn;
};

export type Name = {
  __typename: "Name";
  first?: string;
  middle?: string | null;
  last?: string;
};

export type Address = {
  __typename: "Address";
  addressOne?: string;
  addressTwo?: string | null;
  city?: string;
  state?: string;
  zip?: string;
};

export type Phone = {
  __typename: "Phone";
  primary?: string;
};

export type Dob = {
  __typename: "Dob";
  year?: string;
  month?: string;
  day?: string;
};

export type Ssn = {
  __typename: "Ssn";
  lastfour?: string;
  full?: string | null;
};

export type Onboarding = {
  __typename: "Onboarding";
  lastActive?: number;
  lastComplete?: number;
  started?: boolean | null;
  abandoned?: boolean | null;
  display?: Array<OnboardingStep | null> | null;
};

export type OnboardingStep = {
  __typename: "OnboardingStep";
  id?: number | null;
  active?: boolean | null;
  complete?: boolean | null;
  abandoned?: boolean | null;
  name?: string | null;
};

export type Agencies = {
  __typename: "Agencies";
  transunion?: Transunion;
  equifax?: Equifax;
  experian?: Experian;
};

export type Equifax = {
  __typename: "Equifax";
  authenticated?: boolean | null;
};

export type Experian = {
  __typename: "Experian";
  authenticated?: boolean | null;
};

export type Preferences = {
  __typename: "Preferences";
  showAllAccounts?: ShowAccountsPreference;
};

export type ShowAccountsPreference = {
  __typename: "ShowAccountsPreference";
  creditCards?: boolean | null;
  collectionsAccounts?: boolean | null;
  installmentLoans?: boolean | null;
  mortgages?: boolean | null;
};

export type UpdateAppDataInput = {
  id: string;
  user?: UserInput | null;
  agencies?: AgenciesInput | null;
  preferences?: PreferencesInput | null;
  status?: string | null;
  statusReason?: string | null;
  statusReasonDescription?: string | null;
  lastStatusModifiedOn?: string | null;
  nextStatusModifiedOn?: string | null;
};

export type DeleteAppDataInput = {
  id: string;
};

export type ModelAppDataFilterInput = {
  id?: ModelIDInput | null;
  status?: ModelStringInput | null;
  statusReason?: ModelStringInput | null;
  statusReasonDescription?: ModelStringInput | null;
  lastStatusModifiedOn?: ModelStringInput | null;
  nextStatusModifiedOn?: ModelStringInput | null;
  and?: Array<ModelAppDataFilterInput | null> | null;
  or?: Array<ModelAppDataFilterInput | null> | null;
  not?: ModelAppDataFilterInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ModelAppDataConnection = {
  __typename: "ModelAppDataConnection";
  items?: Array<AppData | null> | null;
  nextToken?: string | null;
};

export type PatchTransunionMutation = {
  __typename: "Transunion";
  authenticated?: boolean | null;
  indicativeEnrichmentSuccess?: boolean | null;
  indicativeEnrichmentStatus?: {
    __typename: "TUStatusRef";
    id?: string | null;
    status?: string | null;
    statusDescription?: string | null;
    statusModifiedOn?: string | null;
    statusCode?: string | null;
  } | null;
  getAuthenticationQuestionsSuccess?: boolean | null;
  getAuthenticationQuestionsStatus?: {
    __typename: "TUStatusRef";
    id?: string | null;
    status?: string | null;
    statusDescription?: string | null;
    statusModifiedOn?: string | null;
    statusCode?: string | null;
  } | null;
  verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
  verifyAuthenticationQuestionsOTPStatus?: {
    __typename: "TUStatusRef";
    id?: string | null;
    status?: string | null;
    statusDescription?: string | null;
    statusModifiedOn?: string | null;
    statusCode?: string | null;
  } | null;
  verifyAuthenticationQuestionsKBASuccess?: boolean | null;
  verifyAuthenticationQuestionsKBAStatus?: {
    __typename: "TUStatusRef";
    id?: string | null;
    status?: string | null;
    statusDescription?: string | null;
    statusModifiedOn?: string | null;
    statusCode?: string | null;
  } | null;
  serviceBundleFulfillmentKey?: string | null;
  currentRawQuestions?: string | null;
  currentRawAuthDetails?: string | null;
  authAttempt?: number | null;
  pinRequests?: number | null;
  pinAttempts?: number | null;
  pinCurrentAge?: number | null;
  kbaAttempts?: number | null;
  kbaCurrentAge?: number | null;
  enrollmentKey?: string | null;
  enrollReport?: {
    __typename: "TUReportResponse";
    bureau?: string | null;
    errorResponse?: string | null;
    serviceProduct?: string | null;
    serviceProductFullfillmentKey?: string | null;
    serviceProductObject?: string | null;
    serviceProductTypeId?: string | null;
    serviceProductValue?: string | null;
    status?: string | null;
  } | null;
  enrollMergeReport?: {
    __typename: "TUReportResponse";
    bureau?: string | null;
    errorResponse?: string | null;
    serviceProduct?: string | null;
    serviceProductFullfillmentKey?: string | null;
    serviceProductObject?: string | null;
    serviceProductTypeId?: string | null;
    serviceProductValue?: string | null;
    status?: string | null;
  } | null;
  enrollVantageScore?: {
    __typename: "TUReportResponse";
    bureau?: string | null;
    errorResponse?: string | null;
    serviceProduct?: string | null;
    serviceProductFullfillmentKey?: string | null;
    serviceProductObject?: string | null;
    serviceProductTypeId?: string | null;
    serviceProductValue?: string | null;
    status?: string | null;
  } | null;
  enrolled?: boolean | null;
  enrolledOn?: string | null;
  fulfillReport?: {
    __typename: "TUReportResponse";
    bureau?: string | null;
    errorResponse?: string | null;
    serviceProduct?: string | null;
    serviceProductFullfillmentKey?: string | null;
    serviceProductObject?: string | null;
    serviceProductTypeId?: string | null;
    serviceProductValue?: string | null;
    status?: string | null;
  } | null;
  fulfillMergeReport?: {
    __typename: "TUReportResponse";
    bureau?: string | null;
    errorResponse?: string | null;
    serviceProduct?: string | null;
    serviceProductFullfillmentKey?: string | null;
    serviceProductObject?: string | null;
    serviceProductTypeId?: string | null;
    serviceProductValue?: string | null;
    status?: string | null;
  } | null;
  fulfillVantageScore?: {
    __typename: "TUReportResponse";
    bureau?: string | null;
    errorResponse?: string | null;
    serviceProduct?: string | null;
    serviceProductFullfillmentKey?: string | null;
    serviceProductObject?: string | null;
    serviceProductTypeId?: string | null;
    serviceProductValue?: string | null;
    status?: string | null;
  } | null;
  fulfilledOn?: string | null;
  acknowledgedDisputeTerms?: boolean | null;
  acknowledgedDisputeTermsOn?: string | null;
  disputeServiceBundleFulfillmentKey?: string | null;
  disputeEnrollmentKey?: string | null;
  disputeEnrolled?: boolean | null;
  disputeEnrolledOn?: string | null;
  disputeStatus?: string | null;
  disputes?: Array<{
    __typename: "Dispute";
    id: string;
    appDataId: string;
    disputeId?: string | null;
    disputeStatus?: string | null;
    disputeLetterCode?: string | null;
    disputeLetterContent?: string | null;
    openDisputes?: {
      __typename: "DisputeSummary";
      estimatedCompletionDate?: string | null;
      lastUpdatedDate?: string | null;
      openDate?: string | null;
      requestedDate?: string | null;
      totalClosedDisputedItems?: string | null;
      totalDisputedItems?: string | null;
      totalOpenDisputedItems?: string | null;
      totalPVDisputedItemCount?: string | null;
    } | null;
    closedDisputes?: {
      __typename: "DisputeSummary";
      estimatedCompletionDate?: string | null;
      lastUpdatedDate?: string | null;
      openDate?: string | null;
      requestedDate?: string | null;
      totalClosedDisputedItems?: string | null;
      totalDisputedItems?: string | null;
      totalOpenDisputedItems?: string | null;
      totalPVDisputedItemCount?: string | null;
    } | null;
    pvDisputedItems?: {
      __typename: "PVDisputedItems";
      pvTradelines?: string | null;
      pvPublicRecords?: string | null;
    } | null;
    agencyName?: string | null;
    openedOn?: string | null;
    closedOn?: string | null;
    disputeItems?: string | null;
    disputeInvestigationResults?: string | null;
    disputeCreditBureau?: string | null;
    notificationStatus?: string | null;
    notificationMessage?: string | null;
    notificationSentOn?: string | null;
  } | null> | null;
};

export type CreateAppDataMutation = {
  __typename: "AppData";
  id: string;
  user: {
    __typename: "User";
    id: string;
    userAttributes?: {
      __typename: "UserAttributes";
      name?: {
        __typename: "Name";
        first: string;
        middle?: string | null;
        last: string;
      } | null;
      address?: {
        __typename: "Address";
        addressOne: string;
        addressTwo?: string | null;
        city: string;
        state: string;
        zip: string;
      } | null;
      phone?: {
        __typename: "Phone";
        primary: string;
      } | null;
      dob?: {
        __typename: "Dob";
        year: string;
        month: string;
        day: string;
      } | null;
      ssn?: {
        __typename: "Ssn";
        lastfour: string;
        full?: string | null;
      } | null;
    } | null;
    onboarding?: {
      __typename: "Onboarding";
      lastActive: number;
      lastComplete: number;
      started?: boolean | null;
      abandoned?: boolean | null;
      display?: Array<{
        __typename: "OnboardingStep";
        id?: number | null;
        active?: boolean | null;
        complete?: boolean | null;
        abandoned?: boolean | null;
        name?: string | null;
      } | null> | null;
    } | null;
  };
  agencies: {
    __typename: "Agencies";
    transunion?: {
      __typename: "Transunion";
      authenticated?: boolean | null;
      indicativeEnrichmentSuccess?: boolean | null;
      indicativeEnrichmentStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      getAuthenticationQuestionsSuccess?: boolean | null;
      getAuthenticationQuestionsStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
      verifyAuthenticationQuestionsOTPStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsKBASuccess?: boolean | null;
      verifyAuthenticationQuestionsKBAStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      serviceBundleFulfillmentKey?: string | null;
      currentRawQuestions?: string | null;
      currentRawAuthDetails?: string | null;
      authAttempt?: number | null;
      pinRequests?: number | null;
      pinAttempts?: number | null;
      pinCurrentAge?: number | null;
      kbaAttempts?: number | null;
      kbaCurrentAge?: number | null;
      enrollmentKey?: string | null;
      enrollReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrolled?: boolean | null;
      enrolledOn?: string | null;
      fulfillReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfilledOn?: string | null;
      acknowledgedDisputeTerms?: boolean | null;
      acknowledgedDisputeTermsOn?: string | null;
      disputeServiceBundleFulfillmentKey?: string | null;
      disputeEnrollmentKey?: string | null;
      disputeEnrolled?: boolean | null;
      disputeEnrolledOn?: string | null;
      disputeStatus?: string | null;
      disputes?: Array<{
        __typename: "Dispute";
        id: string;
        appDataId: string;
        disputeId?: string | null;
        disputeStatus?: string | null;
        disputeLetterCode?: string | null;
        disputeLetterContent?: string | null;
        openDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        closedDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        pvDisputedItems?: {
          __typename: "PVDisputedItems";
          pvTradelines?: string | null;
          pvPublicRecords?: string | null;
        } | null;
        agencyName?: string | null;
        openedOn?: string | null;
        closedOn?: string | null;
        disputeItems?: string | null;
        disputeInvestigationResults?: string | null;
        disputeCreditBureau?: string | null;
        notificationStatus?: string | null;
        notificationMessage?: string | null;
        notificationSentOn?: string | null;
      } | null> | null;
    } | null;
    equifax?: {
      __typename: "Equifax";
      authenticated?: boolean | null;
    } | null;
    experian?: {
      __typename: "Experian";
      authenticated?: boolean | null;
    } | null;
  };
  preferences: {
    __typename: "Preferences";
    showAllAccounts?: {
      __typename: "ShowAccountsPreference";
      creditCards?: boolean | null;
      collectionsAccounts?: boolean | null;
      installmentLoans?: boolean | null;
      mortgages?: boolean | null;
    } | null;
  };
  status?: string | null;
  statusReason?: string | null;
  statusReasonDescription?: string | null;
  lastStatusModifiedOn?: string | null;
  nextStatusModifiedOn?: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type UpdateAppDataMutation = {
  __typename: "AppData";
  id: string;
  user: {
    __typename: "User";
    id: string;
    userAttributes?: {
      __typename: "UserAttributes";
      name?: {
        __typename: "Name";
        first: string;
        middle?: string | null;
        last: string;
      } | null;
      address?: {
        __typename: "Address";
        addressOne: string;
        addressTwo?: string | null;
        city: string;
        state: string;
        zip: string;
      } | null;
      phone?: {
        __typename: "Phone";
        primary: string;
      } | null;
      dob?: {
        __typename: "Dob";
        year: string;
        month: string;
        day: string;
      } | null;
      ssn?: {
        __typename: "Ssn";
        lastfour: string;
        full?: string | null;
      } | null;
    } | null;
    onboarding?: {
      __typename: "Onboarding";
      lastActive: number;
      lastComplete: number;
      started?: boolean | null;
      abandoned?: boolean | null;
      display?: Array<{
        __typename: "OnboardingStep";
        id?: number | null;
        active?: boolean | null;
        complete?: boolean | null;
        abandoned?: boolean | null;
        name?: string | null;
      } | null> | null;
    } | null;
  };
  agencies: {
    __typename: "Agencies";
    transunion?: {
      __typename: "Transunion";
      authenticated?: boolean | null;
      indicativeEnrichmentSuccess?: boolean | null;
      indicativeEnrichmentStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      getAuthenticationQuestionsSuccess?: boolean | null;
      getAuthenticationQuestionsStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
      verifyAuthenticationQuestionsOTPStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsKBASuccess?: boolean | null;
      verifyAuthenticationQuestionsKBAStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      serviceBundleFulfillmentKey?: string | null;
      currentRawQuestions?: string | null;
      currentRawAuthDetails?: string | null;
      authAttempt?: number | null;
      pinRequests?: number | null;
      pinAttempts?: number | null;
      pinCurrentAge?: number | null;
      kbaAttempts?: number | null;
      kbaCurrentAge?: number | null;
      enrollmentKey?: string | null;
      enrollReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrolled?: boolean | null;
      enrolledOn?: string | null;
      fulfillReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfilledOn?: string | null;
      acknowledgedDisputeTerms?: boolean | null;
      acknowledgedDisputeTermsOn?: string | null;
      disputeServiceBundleFulfillmentKey?: string | null;
      disputeEnrollmentKey?: string | null;
      disputeEnrolled?: boolean | null;
      disputeEnrolledOn?: string | null;
      disputeStatus?: string | null;
      disputes?: Array<{
        __typename: "Dispute";
        id: string;
        appDataId: string;
        disputeId?: string | null;
        disputeStatus?: string | null;
        disputeLetterCode?: string | null;
        disputeLetterContent?: string | null;
        openDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        closedDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        pvDisputedItems?: {
          __typename: "PVDisputedItems";
          pvTradelines?: string | null;
          pvPublicRecords?: string | null;
        } | null;
        agencyName?: string | null;
        openedOn?: string | null;
        closedOn?: string | null;
        disputeItems?: string | null;
        disputeInvestigationResults?: string | null;
        disputeCreditBureau?: string | null;
        notificationStatus?: string | null;
        notificationMessage?: string | null;
        notificationSentOn?: string | null;
      } | null> | null;
    } | null;
    equifax?: {
      __typename: "Equifax";
      authenticated?: boolean | null;
    } | null;
    experian?: {
      __typename: "Experian";
      authenticated?: boolean | null;
    } | null;
  };
  preferences: {
    __typename: "Preferences";
    showAllAccounts?: {
      __typename: "ShowAccountsPreference";
      creditCards?: boolean | null;
      collectionsAccounts?: boolean | null;
      installmentLoans?: boolean | null;
      mortgages?: boolean | null;
    } | null;
  };
  status?: string | null;
  statusReason?: string | null;
  statusReasonDescription?: string | null;
  lastStatusModifiedOn?: string | null;
  nextStatusModifiedOn?: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type DeleteAppDataMutation = {
  __typename: "AppData";
  id: string;
  user: {
    __typename: "User";
    id: string;
    userAttributes?: {
      __typename: "UserAttributes";
      name?: {
        __typename: "Name";
        first: string;
        middle?: string | null;
        last: string;
      } | null;
      address?: {
        __typename: "Address";
        addressOne: string;
        addressTwo?: string | null;
        city: string;
        state: string;
        zip: string;
      } | null;
      phone?: {
        __typename: "Phone";
        primary: string;
      } | null;
      dob?: {
        __typename: "Dob";
        year: string;
        month: string;
        day: string;
      } | null;
      ssn?: {
        __typename: "Ssn";
        lastfour: string;
        full?: string | null;
      } | null;
    } | null;
    onboarding?: {
      __typename: "Onboarding";
      lastActive: number;
      lastComplete: number;
      started?: boolean | null;
      abandoned?: boolean | null;
      display?: Array<{
        __typename: "OnboardingStep";
        id?: number | null;
        active?: boolean | null;
        complete?: boolean | null;
        abandoned?: boolean | null;
        name?: string | null;
      } | null> | null;
    } | null;
  };
  agencies: {
    __typename: "Agencies";
    transunion?: {
      __typename: "Transunion";
      authenticated?: boolean | null;
      indicativeEnrichmentSuccess?: boolean | null;
      indicativeEnrichmentStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      getAuthenticationQuestionsSuccess?: boolean | null;
      getAuthenticationQuestionsStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
      verifyAuthenticationQuestionsOTPStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsKBASuccess?: boolean | null;
      verifyAuthenticationQuestionsKBAStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      serviceBundleFulfillmentKey?: string | null;
      currentRawQuestions?: string | null;
      currentRawAuthDetails?: string | null;
      authAttempt?: number | null;
      pinRequests?: number | null;
      pinAttempts?: number | null;
      pinCurrentAge?: number | null;
      kbaAttempts?: number | null;
      kbaCurrentAge?: number | null;
      enrollmentKey?: string | null;
      enrollReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrolled?: boolean | null;
      enrolledOn?: string | null;
      fulfillReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfilledOn?: string | null;
      acknowledgedDisputeTerms?: boolean | null;
      acknowledgedDisputeTermsOn?: string | null;
      disputeServiceBundleFulfillmentKey?: string | null;
      disputeEnrollmentKey?: string | null;
      disputeEnrolled?: boolean | null;
      disputeEnrolledOn?: string | null;
      disputeStatus?: string | null;
      disputes?: Array<{
        __typename: "Dispute";
        id: string;
        appDataId: string;
        disputeId?: string | null;
        disputeStatus?: string | null;
        disputeLetterCode?: string | null;
        disputeLetterContent?: string | null;
        openDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        closedDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        pvDisputedItems?: {
          __typename: "PVDisputedItems";
          pvTradelines?: string | null;
          pvPublicRecords?: string | null;
        } | null;
        agencyName?: string | null;
        openedOn?: string | null;
        closedOn?: string | null;
        disputeItems?: string | null;
        disputeInvestigationResults?: string | null;
        disputeCreditBureau?: string | null;
        notificationStatus?: string | null;
        notificationMessage?: string | null;
        notificationSentOn?: string | null;
      } | null> | null;
    } | null;
    equifax?: {
      __typename: "Equifax";
      authenticated?: boolean | null;
    } | null;
    experian?: {
      __typename: "Experian";
      authenticated?: boolean | null;
    } | null;
  };
  preferences: {
    __typename: "Preferences";
    showAllAccounts?: {
      __typename: "ShowAccountsPreference";
      creditCards?: boolean | null;
      collectionsAccounts?: boolean | null;
      installmentLoans?: boolean | null;
      mortgages?: boolean | null;
    } | null;
  };
  status?: string | null;
  statusReason?: string | null;
  statusReasonDescription?: string | null;
  lastStatusModifiedOn?: string | null;
  nextStatusModifiedOn?: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type GetAppDataQuery = {
  __typename: "AppData";
  id: string;
  user: {
    __typename: "User";
    id: string;
    userAttributes?: {
      __typename: "UserAttributes";
      name?: {
        __typename: "Name";
        first: string;
        middle?: string | null;
        last: string;
      } | null;
      address?: {
        __typename: "Address";
        addressOne: string;
        addressTwo?: string | null;
        city: string;
        state: string;
        zip: string;
      } | null;
      phone?: {
        __typename: "Phone";
        primary: string;
      } | null;
      dob?: {
        __typename: "Dob";
        year: string;
        month: string;
        day: string;
      } | null;
      ssn?: {
        __typename: "Ssn";
        lastfour: string;
        full?: string | null;
      } | null;
    } | null;
    onboarding?: {
      __typename: "Onboarding";
      lastActive: number;
      lastComplete: number;
      started?: boolean | null;
      abandoned?: boolean | null;
      display?: Array<{
        __typename: "OnboardingStep";
        id?: number | null;
        active?: boolean | null;
        complete?: boolean | null;
        abandoned?: boolean | null;
        name?: string | null;
      } | null> | null;
    } | null;
  };
  agencies: {
    __typename: "Agencies";
    transunion?: {
      __typename: "Transunion";
      authenticated?: boolean | null;
      indicativeEnrichmentSuccess?: boolean | null;
      indicativeEnrichmentStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      getAuthenticationQuestionsSuccess?: boolean | null;
      getAuthenticationQuestionsStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
      verifyAuthenticationQuestionsOTPStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsKBASuccess?: boolean | null;
      verifyAuthenticationQuestionsKBAStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      serviceBundleFulfillmentKey?: string | null;
      currentRawQuestions?: string | null;
      currentRawAuthDetails?: string | null;
      authAttempt?: number | null;
      pinRequests?: number | null;
      pinAttempts?: number | null;
      pinCurrentAge?: number | null;
      kbaAttempts?: number | null;
      kbaCurrentAge?: number | null;
      enrollmentKey?: string | null;
      enrollReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrolled?: boolean | null;
      enrolledOn?: string | null;
      fulfillReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfilledOn?: string | null;
      acknowledgedDisputeTerms?: boolean | null;
      acknowledgedDisputeTermsOn?: string | null;
      disputeServiceBundleFulfillmentKey?: string | null;
      disputeEnrollmentKey?: string | null;
      disputeEnrolled?: boolean | null;
      disputeEnrolledOn?: string | null;
      disputeStatus?: string | null;
      disputes?: Array<{
        __typename: "Dispute";
        id: string;
        appDataId: string;
        disputeId?: string | null;
        disputeStatus?: string | null;
        disputeLetterCode?: string | null;
        disputeLetterContent?: string | null;
        openDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        closedDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        pvDisputedItems?: {
          __typename: "PVDisputedItems";
          pvTradelines?: string | null;
          pvPublicRecords?: string | null;
        } | null;
        agencyName?: string | null;
        openedOn?: string | null;
        closedOn?: string | null;
        disputeItems?: string | null;
        disputeInvestigationResults?: string | null;
        disputeCreditBureau?: string | null;
        notificationStatus?: string | null;
        notificationMessage?: string | null;
        notificationSentOn?: string | null;
      } | null> | null;
    } | null;
    equifax?: {
      __typename: "Equifax";
      authenticated?: boolean | null;
    } | null;
    experian?: {
      __typename: "Experian";
      authenticated?: boolean | null;
    } | null;
  };
  preferences: {
    __typename: "Preferences";
    showAllAccounts?: {
      __typename: "ShowAccountsPreference";
      creditCards?: boolean | null;
      collectionsAccounts?: boolean | null;
      installmentLoans?: boolean | null;
      mortgages?: boolean | null;
    } | null;
  };
  status?: string | null;
  statusReason?: string | null;
  statusReasonDescription?: string | null;
  lastStatusModifiedOn?: string | null;
  nextStatusModifiedOn?: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type ListAppDatasQuery = {
  __typename: "ModelAppDataConnection";
  items?: Array<{
    __typename: "AppData";
    id: string;
    user: {
      __typename: "User";
      id: string;
      userAttributes?: {
        __typename: "UserAttributes";
        name?: {
          __typename: "Name";
          first: string;
          middle?: string | null;
          last: string;
        } | null;
        address?: {
          __typename: "Address";
          addressOne: string;
          addressTwo?: string | null;
          city: string;
          state: string;
          zip: string;
        } | null;
        phone?: {
          __typename: "Phone";
          primary: string;
        } | null;
        dob?: {
          __typename: "Dob";
          year: string;
          month: string;
          day: string;
        } | null;
        ssn?: {
          __typename: "Ssn";
          lastfour: string;
          full?: string | null;
        } | null;
      } | null;
      onboarding?: {
        __typename: "Onboarding";
        lastActive: number;
        lastComplete: number;
        started?: boolean | null;
        abandoned?: boolean | null;
        display?: Array<{
          __typename: "OnboardingStep";
          id?: number | null;
          active?: boolean | null;
          complete?: boolean | null;
          abandoned?: boolean | null;
          name?: string | null;
        } | null> | null;
      } | null;
    };
    agencies: {
      __typename: "Agencies";
      transunion?: {
        __typename: "Transunion";
        authenticated?: boolean | null;
        indicativeEnrichmentSuccess?: boolean | null;
        indicativeEnrichmentStatus?: {
          __typename: "TUStatusRef";
          id?: string | null;
          status?: string | null;
          statusDescription?: string | null;
          statusModifiedOn?: string | null;
          statusCode?: string | null;
        } | null;
        getAuthenticationQuestionsSuccess?: boolean | null;
        getAuthenticationQuestionsStatus?: {
          __typename: "TUStatusRef";
          id?: string | null;
          status?: string | null;
          statusDescription?: string | null;
          statusModifiedOn?: string | null;
          statusCode?: string | null;
        } | null;
        verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
        verifyAuthenticationQuestionsOTPStatus?: {
          __typename: "TUStatusRef";
          id?: string | null;
          status?: string | null;
          statusDescription?: string | null;
          statusModifiedOn?: string | null;
          statusCode?: string | null;
        } | null;
        verifyAuthenticationQuestionsKBASuccess?: boolean | null;
        verifyAuthenticationQuestionsKBAStatus?: {
          __typename: "TUStatusRef";
          id?: string | null;
          status?: string | null;
          statusDescription?: string | null;
          statusModifiedOn?: string | null;
          statusCode?: string | null;
        } | null;
        serviceBundleFulfillmentKey?: string | null;
        currentRawQuestions?: string | null;
        currentRawAuthDetails?: string | null;
        authAttempt?: number | null;
        pinRequests?: number | null;
        pinAttempts?: number | null;
        pinCurrentAge?: number | null;
        kbaAttempts?: number | null;
        kbaCurrentAge?: number | null;
        enrollmentKey?: string | null;
        enrollReport?: {
          __typename: "TUReportResponse";
          bureau?: string | null;
          errorResponse?: string | null;
          serviceProduct?: string | null;
          serviceProductFullfillmentKey?: string | null;
          serviceProductObject?: string | null;
          serviceProductTypeId?: string | null;
          serviceProductValue?: string | null;
          status?: string | null;
        } | null;
        enrollMergeReport?: {
          __typename: "TUReportResponse";
          bureau?: string | null;
          errorResponse?: string | null;
          serviceProduct?: string | null;
          serviceProductFullfillmentKey?: string | null;
          serviceProductObject?: string | null;
          serviceProductTypeId?: string | null;
          serviceProductValue?: string | null;
          status?: string | null;
        } | null;
        enrollVantageScore?: {
          __typename: "TUReportResponse";
          bureau?: string | null;
          errorResponse?: string | null;
          serviceProduct?: string | null;
          serviceProductFullfillmentKey?: string | null;
          serviceProductObject?: string | null;
          serviceProductTypeId?: string | null;
          serviceProductValue?: string | null;
          status?: string | null;
        } | null;
        enrolled?: boolean | null;
        enrolledOn?: string | null;
        fulfillReport?: {
          __typename: "TUReportResponse";
          bureau?: string | null;
          errorResponse?: string | null;
          serviceProduct?: string | null;
          serviceProductFullfillmentKey?: string | null;
          serviceProductObject?: string | null;
          serviceProductTypeId?: string | null;
          serviceProductValue?: string | null;
          status?: string | null;
        } | null;
        fulfillMergeReport?: {
          __typename: "TUReportResponse";
          bureau?: string | null;
          errorResponse?: string | null;
          serviceProduct?: string | null;
          serviceProductFullfillmentKey?: string | null;
          serviceProductObject?: string | null;
          serviceProductTypeId?: string | null;
          serviceProductValue?: string | null;
          status?: string | null;
        } | null;
        fulfillVantageScore?: {
          __typename: "TUReportResponse";
          bureau?: string | null;
          errorResponse?: string | null;
          serviceProduct?: string | null;
          serviceProductFullfillmentKey?: string | null;
          serviceProductObject?: string | null;
          serviceProductTypeId?: string | null;
          serviceProductValue?: string | null;
          status?: string | null;
        } | null;
        fulfilledOn?: string | null;
        acknowledgedDisputeTerms?: boolean | null;
        acknowledgedDisputeTermsOn?: string | null;
        disputeServiceBundleFulfillmentKey?: string | null;
        disputeEnrollmentKey?: string | null;
        disputeEnrolled?: boolean | null;
        disputeEnrolledOn?: string | null;
        disputeStatus?: string | null;
        disputes?: Array<{
          __typename: "Dispute";
          id: string;
          appDataId: string;
          disputeId?: string | null;
          disputeStatus?: string | null;
          disputeLetterCode?: string | null;
          disputeLetterContent?: string | null;
          openDisputes?: {
            __typename: "DisputeSummary";
            estimatedCompletionDate?: string | null;
            lastUpdatedDate?: string | null;
            openDate?: string | null;
            requestedDate?: string | null;
            totalClosedDisputedItems?: string | null;
            totalDisputedItems?: string | null;
            totalOpenDisputedItems?: string | null;
            totalPVDisputedItemCount?: string | null;
          } | null;
          closedDisputes?: {
            __typename: "DisputeSummary";
            estimatedCompletionDate?: string | null;
            lastUpdatedDate?: string | null;
            openDate?: string | null;
            requestedDate?: string | null;
            totalClosedDisputedItems?: string | null;
            totalDisputedItems?: string | null;
            totalOpenDisputedItems?: string | null;
            totalPVDisputedItemCount?: string | null;
          } | null;
          pvDisputedItems?: {
            __typename: "PVDisputedItems";
            pvTradelines?: string | null;
            pvPublicRecords?: string | null;
          } | null;
          agencyName?: string | null;
          openedOn?: string | null;
          closedOn?: string | null;
          disputeItems?: string | null;
          disputeInvestigationResults?: string | null;
          disputeCreditBureau?: string | null;
          notificationStatus?: string | null;
          notificationMessage?: string | null;
          notificationSentOn?: string | null;
        } | null> | null;
      } | null;
      equifax?: {
        __typename: "Equifax";
        authenticated?: boolean | null;
      } | null;
      experian?: {
        __typename: "Experian";
        authenticated?: boolean | null;
      } | null;
    };
    preferences: {
      __typename: "Preferences";
      showAllAccounts?: {
        __typename: "ShowAccountsPreference";
        creditCards?: boolean | null;
        collectionsAccounts?: boolean | null;
        installmentLoans?: boolean | null;
        mortgages?: boolean | null;
      } | null;
    };
    status?: string | null;
    statusReason?: string | null;
    statusReasonDescription?: string | null;
    lastStatusModifiedOn?: string | null;
    nextStatusModifiedOn?: string | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null> | null;
  nextToken?: string | null;
};

export type OnCreateAppDataSubscription = {
  __typename: "AppData";
  id: string;
  user: {
    __typename: "User";
    id: string;
    userAttributes?: {
      __typename: "UserAttributes";
      name?: {
        __typename: "Name";
        first: string;
        middle?: string | null;
        last: string;
      } | null;
      address?: {
        __typename: "Address";
        addressOne: string;
        addressTwo?: string | null;
        city: string;
        state: string;
        zip: string;
      } | null;
      phone?: {
        __typename: "Phone";
        primary: string;
      } | null;
      dob?: {
        __typename: "Dob";
        year: string;
        month: string;
        day: string;
      } | null;
      ssn?: {
        __typename: "Ssn";
        lastfour: string;
        full?: string | null;
      } | null;
    } | null;
    onboarding?: {
      __typename: "Onboarding";
      lastActive: number;
      lastComplete: number;
      started?: boolean | null;
      abandoned?: boolean | null;
      display?: Array<{
        __typename: "OnboardingStep";
        id?: number | null;
        active?: boolean | null;
        complete?: boolean | null;
        abandoned?: boolean | null;
        name?: string | null;
      } | null> | null;
    } | null;
  };
  agencies: {
    __typename: "Agencies";
    transunion?: {
      __typename: "Transunion";
      authenticated?: boolean | null;
      indicativeEnrichmentSuccess?: boolean | null;
      indicativeEnrichmentStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      getAuthenticationQuestionsSuccess?: boolean | null;
      getAuthenticationQuestionsStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
      verifyAuthenticationQuestionsOTPStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsKBASuccess?: boolean | null;
      verifyAuthenticationQuestionsKBAStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      serviceBundleFulfillmentKey?: string | null;
      currentRawQuestions?: string | null;
      currentRawAuthDetails?: string | null;
      authAttempt?: number | null;
      pinRequests?: number | null;
      pinAttempts?: number | null;
      pinCurrentAge?: number | null;
      kbaAttempts?: number | null;
      kbaCurrentAge?: number | null;
      enrollmentKey?: string | null;
      enrollReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrolled?: boolean | null;
      enrolledOn?: string | null;
      fulfillReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfilledOn?: string | null;
      acknowledgedDisputeTerms?: boolean | null;
      acknowledgedDisputeTermsOn?: string | null;
      disputeServiceBundleFulfillmentKey?: string | null;
      disputeEnrollmentKey?: string | null;
      disputeEnrolled?: boolean | null;
      disputeEnrolledOn?: string | null;
      disputeStatus?: string | null;
      disputes?: Array<{
        __typename: "Dispute";
        id: string;
        appDataId: string;
        disputeId?: string | null;
        disputeStatus?: string | null;
        disputeLetterCode?: string | null;
        disputeLetterContent?: string | null;
        openDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        closedDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        pvDisputedItems?: {
          __typename: "PVDisputedItems";
          pvTradelines?: string | null;
          pvPublicRecords?: string | null;
        } | null;
        agencyName?: string | null;
        openedOn?: string | null;
        closedOn?: string | null;
        disputeItems?: string | null;
        disputeInvestigationResults?: string | null;
        disputeCreditBureau?: string | null;
        notificationStatus?: string | null;
        notificationMessage?: string | null;
        notificationSentOn?: string | null;
      } | null> | null;
    } | null;
    equifax?: {
      __typename: "Equifax";
      authenticated?: boolean | null;
    } | null;
    experian?: {
      __typename: "Experian";
      authenticated?: boolean | null;
    } | null;
  };
  preferences: {
    __typename: "Preferences";
    showAllAccounts?: {
      __typename: "ShowAccountsPreference";
      creditCards?: boolean | null;
      collectionsAccounts?: boolean | null;
      installmentLoans?: boolean | null;
      mortgages?: boolean | null;
    } | null;
  };
  status?: string | null;
  statusReason?: string | null;
  statusReasonDescription?: string | null;
  lastStatusModifiedOn?: string | null;
  nextStatusModifiedOn?: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnUpdateAppDataSubscription = {
  __typename: "AppData";
  id: string;
  user: {
    __typename: "User";
    id: string;
    userAttributes?: {
      __typename: "UserAttributes";
      name?: {
        __typename: "Name";
        first: string;
        middle?: string | null;
        last: string;
      } | null;
      address?: {
        __typename: "Address";
        addressOne: string;
        addressTwo?: string | null;
        city: string;
        state: string;
        zip: string;
      } | null;
      phone?: {
        __typename: "Phone";
        primary: string;
      } | null;
      dob?: {
        __typename: "Dob";
        year: string;
        month: string;
        day: string;
      } | null;
      ssn?: {
        __typename: "Ssn";
        lastfour: string;
        full?: string | null;
      } | null;
    } | null;
    onboarding?: {
      __typename: "Onboarding";
      lastActive: number;
      lastComplete: number;
      started?: boolean | null;
      abandoned?: boolean | null;
      display?: Array<{
        __typename: "OnboardingStep";
        id?: number | null;
        active?: boolean | null;
        complete?: boolean | null;
        abandoned?: boolean | null;
        name?: string | null;
      } | null> | null;
    } | null;
  };
  agencies: {
    __typename: "Agencies";
    transunion?: {
      __typename: "Transunion";
      authenticated?: boolean | null;
      indicativeEnrichmentSuccess?: boolean | null;
      indicativeEnrichmentStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      getAuthenticationQuestionsSuccess?: boolean | null;
      getAuthenticationQuestionsStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
      verifyAuthenticationQuestionsOTPStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsKBASuccess?: boolean | null;
      verifyAuthenticationQuestionsKBAStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      serviceBundleFulfillmentKey?: string | null;
      currentRawQuestions?: string | null;
      currentRawAuthDetails?: string | null;
      authAttempt?: number | null;
      pinRequests?: number | null;
      pinAttempts?: number | null;
      pinCurrentAge?: number | null;
      kbaAttempts?: number | null;
      kbaCurrentAge?: number | null;
      enrollmentKey?: string | null;
      enrollReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrolled?: boolean | null;
      enrolledOn?: string | null;
      fulfillReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfilledOn?: string | null;
      acknowledgedDisputeTerms?: boolean | null;
      acknowledgedDisputeTermsOn?: string | null;
      disputeServiceBundleFulfillmentKey?: string | null;
      disputeEnrollmentKey?: string | null;
      disputeEnrolled?: boolean | null;
      disputeEnrolledOn?: string | null;
      disputeStatus?: string | null;
      disputes?: Array<{
        __typename: "Dispute";
        id: string;
        appDataId: string;
        disputeId?: string | null;
        disputeStatus?: string | null;
        disputeLetterCode?: string | null;
        disputeLetterContent?: string | null;
        openDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        closedDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        pvDisputedItems?: {
          __typename: "PVDisputedItems";
          pvTradelines?: string | null;
          pvPublicRecords?: string | null;
        } | null;
        agencyName?: string | null;
        openedOn?: string | null;
        closedOn?: string | null;
        disputeItems?: string | null;
        disputeInvestigationResults?: string | null;
        disputeCreditBureau?: string | null;
        notificationStatus?: string | null;
        notificationMessage?: string | null;
        notificationSentOn?: string | null;
      } | null> | null;
    } | null;
    equifax?: {
      __typename: "Equifax";
      authenticated?: boolean | null;
    } | null;
    experian?: {
      __typename: "Experian";
      authenticated?: boolean | null;
    } | null;
  };
  preferences: {
    __typename: "Preferences";
    showAllAccounts?: {
      __typename: "ShowAccountsPreference";
      creditCards?: boolean | null;
      collectionsAccounts?: boolean | null;
      installmentLoans?: boolean | null;
      mortgages?: boolean | null;
    } | null;
  };
  status?: string | null;
  statusReason?: string | null;
  statusReasonDescription?: string | null;
  lastStatusModifiedOn?: string | null;
  nextStatusModifiedOn?: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnDeleteAppDataSubscription = {
  __typename: "AppData";
  id: string;
  user: {
    __typename: "User";
    id: string;
    userAttributes?: {
      __typename: "UserAttributes";
      name?: {
        __typename: "Name";
        first: string;
        middle?: string | null;
        last: string;
      } | null;
      address?: {
        __typename: "Address";
        addressOne: string;
        addressTwo?: string | null;
        city: string;
        state: string;
        zip: string;
      } | null;
      phone?: {
        __typename: "Phone";
        primary: string;
      } | null;
      dob?: {
        __typename: "Dob";
        year: string;
        month: string;
        day: string;
      } | null;
      ssn?: {
        __typename: "Ssn";
        lastfour: string;
        full?: string | null;
      } | null;
    } | null;
    onboarding?: {
      __typename: "Onboarding";
      lastActive: number;
      lastComplete: number;
      started?: boolean | null;
      abandoned?: boolean | null;
      display?: Array<{
        __typename: "OnboardingStep";
        id?: number | null;
        active?: boolean | null;
        complete?: boolean | null;
        abandoned?: boolean | null;
        name?: string | null;
      } | null> | null;
    } | null;
  };
  agencies: {
    __typename: "Agencies";
    transunion?: {
      __typename: "Transunion";
      authenticated?: boolean | null;
      indicativeEnrichmentSuccess?: boolean | null;
      indicativeEnrichmentStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      getAuthenticationQuestionsSuccess?: boolean | null;
      getAuthenticationQuestionsStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
      verifyAuthenticationQuestionsOTPStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      verifyAuthenticationQuestionsKBASuccess?: boolean | null;
      verifyAuthenticationQuestionsKBAStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
      } | null;
      serviceBundleFulfillmentKey?: string | null;
      currentRawQuestions?: string | null;
      currentRawAuthDetails?: string | null;
      authAttempt?: number | null;
      pinRequests?: number | null;
      pinAttempts?: number | null;
      pinCurrentAge?: number | null;
      kbaAttempts?: number | null;
      kbaCurrentAge?: number | null;
      enrollmentKey?: string | null;
      enrollReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrollVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      enrolled?: boolean | null;
      enrolledOn?: string | null;
      fulfillReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfillVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
      } | null;
      fulfilledOn?: string | null;
      acknowledgedDisputeTerms?: boolean | null;
      acknowledgedDisputeTermsOn?: string | null;
      disputeServiceBundleFulfillmentKey?: string | null;
      disputeEnrollmentKey?: string | null;
      disputeEnrolled?: boolean | null;
      disputeEnrolledOn?: string | null;
      disputeStatus?: string | null;
      disputes?: Array<{
        __typename: "Dispute";
        id: string;
        appDataId: string;
        disputeId?: string | null;
        disputeStatus?: string | null;
        disputeLetterCode?: string | null;
        disputeLetterContent?: string | null;
        openDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        closedDisputes?: {
          __typename: "DisputeSummary";
          estimatedCompletionDate?: string | null;
          lastUpdatedDate?: string | null;
          openDate?: string | null;
          requestedDate?: string | null;
          totalClosedDisputedItems?: string | null;
          totalDisputedItems?: string | null;
          totalOpenDisputedItems?: string | null;
          totalPVDisputedItemCount?: string | null;
        } | null;
        pvDisputedItems?: {
          __typename: "PVDisputedItems";
          pvTradelines?: string | null;
          pvPublicRecords?: string | null;
        } | null;
        agencyName?: string | null;
        openedOn?: string | null;
        closedOn?: string | null;
        disputeItems?: string | null;
        disputeInvestigationResults?: string | null;
        disputeCreditBureau?: string | null;
        notificationStatus?: string | null;
        notificationMessage?: string | null;
        notificationSentOn?: string | null;
      } | null> | null;
    } | null;
    equifax?: {
      __typename: "Equifax";
      authenticated?: boolean | null;
    } | null;
    experian?: {
      __typename: "Experian";
      authenticated?: boolean | null;
    } | null;
  };
  preferences: {
    __typename: "Preferences";
    showAllAccounts?: {
      __typename: "ShowAccountsPreference";
      creditCards?: boolean | null;
      collectionsAccounts?: boolean | null;
      installmentLoans?: boolean | null;
      mortgages?: boolean | null;
    } | null;
  };
  status?: string | null;
  statusReason?: string | null;
  statusReasonDescription?: string | null;
  lastStatusModifiedOn?: string | null;
  nextStatusModifiedOn?: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};
