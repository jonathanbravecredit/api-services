import {
  DefaultRequestMap,
  GetAuthenticationQuestionsRequestMap,
  IndicativeEnrichmentRequestMap,
} from 'lib/utils/requests/requests-map';
import {
  DefaultRequestXML,
  GetAuthenticationQuestionsRequestXML,
  IndicativeEnrichmentRequestXML,
} from 'lib/utils/requests/requests-xml';

export enum APIRequestKeys {
  DEFAULTS = 'defaults',
  FULFILL = 'fulfill',
  ENROLL = 'enroll',
  INDICATIVE_ENRICHMENT = 'indicative-enrichment',
  GET_AUTHENTICATION_QUESTIONS = 'get-authentication-questions',
}

export const APIRequestLibrary = {
  [APIRequestKeys.DEFAULTS]: DefaultRequestMap,
  [APIRequestKeys.FULFILL]: {},
  [APIRequestKeys.ENROLL]: {},
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestMap,
  [APIRequestKeys.GET_AUTHENTICATION_QUESTIONS]: GetAuthenticationQuestionsRequestMap,
};

export const APIRequestXMLLibrary = {
  [APIRequestKeys.DEFAULTS]: DefaultRequestXML,
  [APIRequestKeys.FULFILL]: {},
  [APIRequestKeys.ENROLL]: {},
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestXML,
  [APIRequestKeys.GET_AUTHENTICATION_QUESTIONS]: GetAuthenticationQuestionsRequestXML,
};
