import {
  MockRequestMap,
  GetAuthenticationQuestionsRequestMap,
  IndicativeEnrichmentRequestMap,
  VerifyAuthenticationQuestionsRequestMap,
} from 'libs/utils/requests/requests-map';
import {
  GetAuthenticationQuestionsRequestXML,
  IndicativeEnrichmentRequestXML,
  MockRequestXML,
  VerifyAuthenticationQuestionsRequestXML,
} from 'libs/utils/requests/requests-xml';

export enum APIRequestKeys {
  MOCK = 'mock',
  FULFILL = 'fulfill',
  ENROLL = 'enroll',
  INDICATIVE_ENRICHMENT = 'indicative-enrichment',
  GET_AUTHENTICATION_QUESTIONS = 'get-authentication-questions',
  VERIFY_AUTHENTICATION_QUESTIONS = 'verify-authentication-questions',
}

export const APIRequestLibrary = {
  [APIRequestKeys.MOCK]: MockRequestMap,
  [APIRequestKeys.FULFILL]: {},
  [APIRequestKeys.ENROLL]: {},
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestMap,
  [APIRequestKeys.GET_AUTHENTICATION_QUESTIONS]: GetAuthenticationQuestionsRequestMap,
  [APIRequestKeys.VERIFY_AUTHENTICATION_QUESTIONS]: VerifyAuthenticationQuestionsRequestMap,
};

export const APIRequestXMLLibrary = {
  [APIRequestKeys.MOCK]: MockRequestXML,
  [APIRequestKeys.FULFILL]: {},
  [APIRequestKeys.ENROLL]: {},
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestXML,
  [APIRequestKeys.GET_AUTHENTICATION_QUESTIONS]: GetAuthenticationQuestionsRequestXML,
  [APIRequestKeys.VERIFY_AUTHENTICATION_QUESTIONS]: VerifyAuthenticationQuestionsRequestXML,
};
