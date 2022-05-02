import {
  DefaultRequestMap,
  GetAuthenticationQuestionsRequestMap,
  IndicativeEnrichmentRequestMap,
  VerifyAuthenticationQuestionsRequestMap,
} from 'lib/utils/requests/requests-map';
import {
  DefaultRequestXML,
  GetAuthenticationQuestionsRequestXML,
  IndicativeEnrichmentRequestXML,
  VerifyAuthenticationQuestionsRequestXML,
} from 'lib/utils/requests/requests-xml';

export enum APIRequestKeys {
  DEFAULTS = 'defaults',
  FULFILL = 'fulfill',
  ENROLL = 'enroll',
  INDICATIVE_ENRICHMENT = 'indicative-enrichment',
  GET_AUTHENTICATION_QUESTIONS = 'get-authentication-questions',
  VERIFY_AUTHENTICATION_QUESTIONS = 'verify-authentication-questions',
}

export const APIRequestLibrary = {
  [APIRequestKeys.DEFAULTS]: DefaultRequestMap,
  [APIRequestKeys.FULFILL]: {},
  [APIRequestKeys.ENROLL]: {},
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestMap,
  [APIRequestKeys.GET_AUTHENTICATION_QUESTIONS]: GetAuthenticationQuestionsRequestMap,
  [APIRequestKeys.VERIFY_AUTHENTICATION_QUESTIONS]: VerifyAuthenticationQuestionsRequestMap,
};

export const APIRequestXMLLibrary = {
  [APIRequestKeys.DEFAULTS]: DefaultRequestXML,
  [APIRequestKeys.FULFILL]: {},
  [APIRequestKeys.ENROLL]: {},
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestXML,
  [APIRequestKeys.GET_AUTHENTICATION_QUESTIONS]: GetAuthenticationQuestionsRequestXML,
  [APIRequestKeys.VERIFY_AUTHENTICATION_QUESTIONS]: VerifyAuthenticationQuestionsRequestXML,
};
