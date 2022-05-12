import {
  IGetInvestigationResultsResponse,
  IGetInvestigationResultsResult,
} from 'libs/transunion/get-investigation-results/get-investigation-results.interface';
import { TUResponder } from 'libs/transunion/tu/tu-responder';
import * as he from 'he';
import * as fastXml from 'fast-xml-parser';
import { Nested as _nest } from '@bravecredit/brave-sdk';

export class GetInvestigationResultsResponder extends TUResponder<IGetInvestigationResultsResponse, any> {
  constructor() {
    super();
  }

  parseResponse(options: any): IGetInvestigationResultsResponse {
    if (!this.xml) throw 'No XML set';
    const obj: IGetInvestigationResultsResponse = fastXml.parse(this.xml, options);
    const investigationResults = _nest.find<string>(obj, 'InvestigationResults');
    const creditBureau = _nest.find<string>(obj, 'CreditBureau');

    let results = obj;
    if (typeof investigationResults === 'string') {
      let clean = he.decode(he.decode(investigationResults));
      const parsed = fastXml.parse(clean, options);
      console.log('parsed IR response ==> ', JSON.stringify(parsed));
      results = _nest.update(results, 'InvestigationResults', parsed);
    }

    if (typeof creditBureau === 'string') {
      let clean = he.decode(he.decode(creditBureau));
      const parsed = fastXml.parse(clean, options);
      console.log('parsed CB response ==> ', JSON.stringify(parsed));
      results = _nest.update(results, 'CreditBureau', parsed);
    }

    console.log('parsed results ==> ', JSON.stringify(results));
    this.response = results;
    return this.response;
  }
}
