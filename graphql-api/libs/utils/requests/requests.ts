import {
  MockRequestMap,
  GetAuthenticationQuestionsRequestMap,
  IndicativeEnrichmentRequestMap,
  VerifyAuthenticationQuestionsRequestMap,
  EnrollRequestMap,
  FulfillRequestMap,
  GetServiceProductMap,
  GetDisputeStatusMap,
} from 'libs/utils/requests/requests-map';
import {
  EnrollRequestXML,
  FulfillRequestXML,
  GetAuthenticationQuestionsRequestXML,
  GetDisputeStatusXML,
  GetServiceProductXML,
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
  ENROLL = 'enroll',
  GET_SERVICE_PRODUCT = 'get-service-product',
  GET_DISPUTE_STATUS = 'get-dispute-status',
}

export const APIRequestLibrary = {
  [APIRequestKeys.MOCK]: MockRequestMap,
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestMap,
  [APIRequestKeys.GET_AUTHENTICATION_QUESTIONS]: GetAuthenticationQuestionsRequestMap,
  [APIRequestKeys.VERIFY_AUTHENTICATION_QUESTIONS]: VerifyAuthenticationQuestionsRequestMap,
  [APIRequestKeys.ENROLL]: EnrollRequestMap,
  [APIRequestKeys.FULFILL]: FulfillRequestMap,
  [APIRequestKeys.GET_SERVICE_PRODUCT]: GetServiceProductMap,
  [APIRequestKeys.GET_DISPUTE_STATUS]: GetDisputeStatusMap,
};

export const APIRequestXMLLibrary = {
  [APIRequestKeys.MOCK]: MockRequestXML,
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestXML,
  [APIRequestKeys.GET_AUTHENTICATION_QUESTIONS]: GetAuthenticationQuestionsRequestXML,
  [APIRequestKeys.VERIFY_AUTHENTICATION_QUESTIONS]: VerifyAuthenticationQuestionsRequestXML,
  [APIRequestKeys.ENROLL]: EnrollRequestXML,
  [APIRequestKeys.FULFILL]: FulfillRequestXML,
  [APIRequestKeys.GET_SERVICE_PRODUCT]: GetServiceProductXML,
  [APIRequestKeys.GET_DISPUTE_STATUS]: GetDisputeStatusXML,
};
