import { DefaultRequestMap, IndicativeEnrichmentRequestMap } from 'lib/utils/requests/requests-map';
import { DefaultRequestXML, IndicativeEnrichmentRequestXML } from 'lib/utils/requests/requests-xml';

export enum APIRequestKeys {
  DEFAULTS = 'defaults',
  FULFILL = 'fulfill',
  ENROLL = 'enroll',
  INDICATIVE_ENRICHMENT = 'indicative-enrichment',
}

export const APIRequestLibrary = {
  [APIRequestKeys.DEFAULTS]: DefaultRequestMap,
  [APIRequestKeys.FULFILL]: {},
  [APIRequestKeys.ENROLL]: {},
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestMap,
};

export const APIRequestXMLLibrary = {
  [APIRequestKeys.DEFAULTS]: DefaultRequestXML,
  [APIRequestKeys.FULFILL]: {},
  [APIRequestKeys.ENROLL]: {},
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestXML,
};
