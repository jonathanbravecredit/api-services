import { IIndicativeEnrichmentResponse } from 'libs/transunion/indicative-enrichment/indicative-enrichment.interface';
import { TUResponder } from 'libs/transunion/tu/tu-responder';

export class IndicativeEnrichmentResponder extends TUResponder<IIndicativeEnrichmentResponse, any> {
  constructor() {
    super();
  }
}
