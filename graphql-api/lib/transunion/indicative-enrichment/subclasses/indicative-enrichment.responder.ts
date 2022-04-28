import * as fastXml from 'fast-xml-parser';
import { Nested as _nest } from 'lib/utils/helpers/Nested';
import { IIndicativeEnrichmentResponse } from 'lib/transunion/indicative-enrichment/indicative-enrichment.interface';
import { TUResponseBase } from 'lib/transunion/tu/TUResponseBase';

export class IndicativeEnrichmentResponder extends TUResponseBase<IIndicativeEnrichmentResponse, any> {
  constructor() {
    super();
  }

  parseResponse(options: any): IIndicativeEnrichmentResponse {
    if (!this.xml) throw 'No XML set';
    const obj: IIndicativeEnrichmentResponse = fastXml.parse(this.xml, options);
    this.response = obj;
    this.responseType = _nest.find(this.response, 'ResponseType');
    this.responseError = _nest.find(this.response, 'ErrorResponse');
    return this.response;
  }

  enrichData(data: any | undefined): null {
    this.enriched = null;
    return this.enriched;
  }
}
