import { IRequestOptions } from 'lib/interfaces/api.interfaces';
import {
  IEnrichedIndicativeEnrichment,
  IIndicativeEnrichmentMsg,
} from 'lib/interfaces/indicative-enrichment.interface';
import * as uuid from 'uuid';
import * as https from 'https';

export const createRequestOptions = (
  httpsAgent: https.Agent,
  auth: string,
  data: string,
  SOAPAction: string,
): IRequestOptions => {
  return {
    url: 'https://cc2ws-live.sd.demo.truelink.com/wcf/CC2.svc',
    method: 'POST',
    data: data,
    httpsAgent,
    headers: {
      'Accept-Encoding': 'gzip,deflate',
      'Content-Type': 'text/xml;charset=UTF-8',
      SOAPAction: `https://consumerconnectws.tui.transunion.com/ICC2/${SOAPAction}`,
      Authorization: auth,
      'Content-Length': data.length,
      Host: 'cc2ws-live.sd.demo.truelink.com',
      Connection: 'Keep-Alive',
      'User-Agent': 'Apache-HttpClient/4.5.2 (Java/1.8.0_181)',
    },
  };
};

export const formatIndicativeEnrichment = (
  accountCode: string,
  accountName: string,
  snsMessage: string,
): IEnrichedIndicativeEnrichment | undefined => {
  let data: IIndicativeEnrichmentMsg = JSON.parse(snsMessage);
  let { message } = data;
  console.log('unformatted msg', JSON.stringify(message));

  const requestKey = uuid.v4();
  return message
    ? {
        request: {
          AccountCode: accountCode,
          AccountName: accountName,
          ...message,
        },
      }
    : undefined;
};
