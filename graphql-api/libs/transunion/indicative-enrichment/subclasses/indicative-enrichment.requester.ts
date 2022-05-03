import { APIRequester } from 'libs/models/api-requester.model';
import { IIndicativeEnrichmentPayload } from 'libs/transunion/indicative-enrichment/indicative-enrichment.interface';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';

export class IndicativeEnrichmentRequester extends TURequester<IIndicativeEnrichmentPayload> implements APIRequester {
  constructor(requestKey: APIRequestKeys, payload: IIndicativeEnrichmentPayload) {
    super(requestKey, payload);
  }
}
