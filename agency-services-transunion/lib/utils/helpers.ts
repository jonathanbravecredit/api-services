import { IndicativeEnrichmentModel } from 'lib/models/indicative-enrichment.model';
import * as uuid from 'uuid';

export const formatIndicativeEnrichment = (
  accountCode: string,
  accountName: string,
  message: string,
): IndicativeEnrichmentModel | undefined => {
  let msg: IndicativeEnrichmentModel | undefined = JSON.parse(message);
  console.log('unformatted msg', msg);
  const requestKey = uuid.v4();
  return msg
    ? {
        AccountCode: accountCode,
        AccountName: accountName,
        RequestKey: requestKey,
        ...msg,
      }
    : undefined;
};
