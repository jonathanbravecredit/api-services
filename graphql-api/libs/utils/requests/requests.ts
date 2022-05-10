import {
  MockRequestMap,
  GetAuthenticationQuestionsRequestMap,
  IndicativeEnrichmentRequestMap,
  VerifyAuthenticationQuestionsRequestMap,
  EnrollRequestMap,
  FulfillRequestMap,
  GetServiceProductMap,
  GetDisputeStatusMap,
  GetDisputeHistoryMap,
  GetTrendingDataMap,
  CancelEnrollmentMap,
  GetInvestigationResultsMap,
  GetAlertsNotifications,
  FulfillDisputeRequestMap,
} from 'libs/utils/requests/requests-map';
import {
  CancelEnrollmentXML,
  EnrollRequestXML,
  FulfillDisputeRequestXML,
  FulfillRequestXML,
  GetAlertsNotificationsXML,
  GetAuthenticationQuestionsRequestXML,
  GetDisputeHistoryXML,
  GetDisputeStatusXML,
  GetInvestigationResultsXML,
  GetServiceProductXML,
  GetTrendingDataXML,
  IndicativeEnrichmentRequestXML,
  MockRequestXML,
  VerifyAuthenticationQuestionsRequestXML,
} from 'libs/utils/requests/requests-xml';

export enum APIRequestKeys {
  MOCK = 'mock',
  INDICATIVE_ENRICHMENT = 'indicative-enrichment',
  GET_AUTHENTICATION_QUESTIONS = 'get-authentication-questions',
  VERIFY_AUTHENTICATION_QUESTIONS = 'verify-authentication-questions',
  FULFILL = 'fulfill',
  FULFILL_DISPUTE = 'fulfill-dispute',
  ENROLL = 'enroll',
  GET_SERVICE_PRODUCT = 'get-service-product',
  GET_DISPUTE_STATUS = 'get-dispute-status',
  GET_DISPUTE_HISTORY = 'get-dispute-history',
  GET_TRENDING_DATA = 'get-trending-data',
  CANCEL_ENROLLMENT = 'cancel-enrollment',
  GET_INVESTIGATION_RESULTS = 'get-investigation-results',
  GET_ALERTS_NOTIFICATIONS = 'get-alerts-notifications',
}

export const APIRequestLibrary = {
  [APIRequestKeys.MOCK]: MockRequestMap,
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestMap,
  [APIRequestKeys.GET_AUTHENTICATION_QUESTIONS]: GetAuthenticationQuestionsRequestMap,
  [APIRequestKeys.VERIFY_AUTHENTICATION_QUESTIONS]: VerifyAuthenticationQuestionsRequestMap,
  [APIRequestKeys.ENROLL]: EnrollRequestMap,
  [APIRequestKeys.FULFILL]: FulfillRequestMap,
  [APIRequestKeys.FULFILL_DISPUTE]: FulfillDisputeRequestMap,
  [APIRequestKeys.GET_SERVICE_PRODUCT]: GetServiceProductMap,
  [APIRequestKeys.GET_DISPUTE_STATUS]: GetDisputeStatusMap,
  [APIRequestKeys.GET_DISPUTE_HISTORY]: GetDisputeHistoryMap,
  [APIRequestKeys.GET_TRENDING_DATA]: GetTrendingDataMap,
  [APIRequestKeys.CANCEL_ENROLLMENT]: CancelEnrollmentMap,
  [APIRequestKeys.GET_INVESTIGATION_RESULTS]: GetInvestigationResultsMap,
  [APIRequestKeys.GET_ALERTS_NOTIFICATIONS]: GetAlertsNotifications,
};

export const APIRequestXMLLibrary = {
  [APIRequestKeys.MOCK]: MockRequestXML,
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestXML,
  [APIRequestKeys.GET_AUTHENTICATION_QUESTIONS]: GetAuthenticationQuestionsRequestXML,
  [APIRequestKeys.VERIFY_AUTHENTICATION_QUESTIONS]: VerifyAuthenticationQuestionsRequestXML,
  [APIRequestKeys.ENROLL]: EnrollRequestXML,
  [APIRequestKeys.FULFILL]: FulfillRequestXML,
  [APIRequestKeys.FULFILL_DISPUTE]: FulfillDisputeRequestXML,
  [APIRequestKeys.GET_SERVICE_PRODUCT]: GetServiceProductXML,
  [APIRequestKeys.GET_DISPUTE_STATUS]: GetDisputeStatusXML,
  [APIRequestKeys.GET_DISPUTE_HISTORY]: GetDisputeHistoryXML,
  [APIRequestKeys.GET_TRENDING_DATA]: GetTrendingDataXML,
  [APIRequestKeys.CANCEL_ENROLLMENT]: CancelEnrollmentXML,
  [APIRequestKeys.GET_INVESTIGATION_RESULTS]: GetInvestigationResultsXML,
  [APIRequestKeys.GET_ALERTS_NOTIFICATIONS]: GetAlertsNotificationsXML,
};
