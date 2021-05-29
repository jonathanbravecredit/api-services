import {
  IEnrichedIndicativeEnrichment,
  IIndicativeEnrichmentMsg,
} from 'lib/interfaces/indicative-enrichment.interface';
import * as uuid from 'uuid';

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
        AccountCode: accountCode,
        AccountName: accountName,
        RequestKey: requestKey,
        ...message,
      }
    : undefined;
};
