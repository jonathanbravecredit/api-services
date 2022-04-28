import { IndicativeEnrichmentRequestMap } from 'lib/utils/requests/requests-map';
import { IndicativeEnrichmentRequestXML } from 'lib/utils/requests/requests-xml';

export enum APIRequestKeys {
  FULFILL = 'fulfill',
  ENROLL = 'enroll',
  INDICATIVE_ENRICHMENT = 'indicative-enrichment',
}

export const APIRequestLibrary = {
  [APIRequestKeys.FULFILL]: {},
  [APIRequestKeys.ENROLL]: {},
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestMap,
};

export const APIRequestXMLLibrary = {
  [APIRequestKeys.FULFILL]: {},
  [APIRequestKeys.ENROLL]: {},
  [APIRequestKeys.INDICATIVE_ENRICHMENT]: IndicativeEnrichmentRequestXML,
};
