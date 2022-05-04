import * as dayjs from 'dayjs';
import { Nested as _nest } from 'libs/utils/helpers/Nested';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { IProxyRequest } from 'libs/interfaces';
import { APIRequest } from 'libs/models/api-request.model';
import {
  IIndicativeEnrichmentPayload,
  IIndicativeEnrichmentResponse,
  IIndicativeEnrichmentResult,
} from 'libs/transunion/indicative-enrichment/indicative-enrichment.interface';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { IndicativeEnrichmentRequester } from 'libs/transunion/indicative-enrichment/subclasses/indicative-enrichment.requester';
import { IndicativeEnrichmentResponder } from 'libs/transunion/indicative-enrichment/subclasses/indicative-enrichment.responder';
import { TUAPIProcessor } from 'libs/transunion/tu/tu-api';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';

export class IndicativeEnrichmentV2
  extends TUAPIProcessor<IIndicativeEnrichmentPayload, IIndicativeEnrichmentResponse, IIndicativeEnrichmentResult>
  implements APIRequest
{
  public payloader = new Payloader<IIndicativeEnrichmentPayload>();
  public action = 'IndicativeEnrichment';
  public schema = 'indicativeEnrichment';
  public resultKey = 'IndicativeEnrichmentResult';
  public serviceBundleCode = 'CC2BraveCreditIndicativeEnrichment';

  constructor(protected payload: IProxyRequest) {
    super(
      'IndicativeEnrichment',
      payload,
      new IndicativeEnrichmentResponder(),
      new Payloader<IIndicativeEnrichmentPayload>(),
      new SoapV2(),
    );
  }

  /**
   * Payloader runner to:
   *  - validate the payload
   *  - prep the payload
   * @returns
   */
  async runPayloader(): Promise<void> {
    await super.runPayloader();
    this.prepped = _nest.update(this.prepped, 'lastfour', `000000000${this.prepped.ssn.lastfour}`.slice(-9));
    this.formatDob(); // added step
  }

  /**
   * Requester runner to:
   * run the indicative enrichment request which:
   *    - accepts the payload
   *    - generates the request object
   *    - generates the request xml
   */
  runRequester(): void {
    const requester = new IndicativeEnrichmentRequester(APIRequestKeys.INDICATIVE_ENRICHMENT, this.prepped);
    this.reqXML = requester.createRequest();
    console.log('reqXML: ', this.reqXML);
  }

  /**
   * TU requires date format in YYYY-MMM-D
   *  ex: 1980-Nov-1
   */
  formatDob(): void {
    const { year, month, day } = this.prepped.dob;
    const iso = dayjs(`${year}-${month}-${day}`, 'YYYY-MMM-D');
    this.prepped.dobformatted = iso.format('YYYY-MM-DD');
  }
}
