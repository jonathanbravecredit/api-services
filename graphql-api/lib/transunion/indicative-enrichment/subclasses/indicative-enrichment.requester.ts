import { APIRequester } from 'lib/models/api-requester.model';
import { IIndicativeEnrichmentPayload } from 'lib/transunion/indicative-enrichment/indicative-enrichment.interface';
import { TURequester } from 'lib/transunion/tu/tu-requester';
import { APIRequestKeys } from 'lib/utils/requests/requests';

export class IndicativeEnrichmentRequester extends TURequester<IIndicativeEnrichmentPayload> implements APIRequester {
  constructor(requestKey: APIRequestKeys, payload: IIndicativeEnrichmentPayload) {
    super(requestKey, payload);
  }
}
