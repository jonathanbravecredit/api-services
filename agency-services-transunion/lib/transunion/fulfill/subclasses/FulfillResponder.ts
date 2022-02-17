import * as fastXml from 'fast-xml-parser';
import * as _ from 'lodash';
import { mapReportResponse } from 'lib/utils/helpers/helpers';
import { IFulfillResponse, IFulfillServiceProductResponse } from 'lib/interfaces';
import { UpdateAppDataInput } from 'src/api/api.service';
import { TUResponseBase } from 'lib/transunion/tu/TUResponseBase';
import { ServiceProductParser as spp } from 'lib/transunion/parsers/ServiceProductParser';
import { Nested as _nest } from 'lib/utils/helpers/Nested';

export class FulfillResponder extends TUResponseBase<IFulfillResponse, UpdateAppDataInput> {
  constructor(protected action: string) {
    super();
  }

  parseResponse(options: any): IFulfillResponse {
    if (!this.xml) throw 'No XML set';
    const obj: IFulfillResponse = fastXml.parse(this.xml, options);
    const spr = _nest.find(obj, 'ServiceProductResponse');
    if (!spr) throw 'No response found';
    if (spr instanceof Array) {
      const mapped = spr.map((prod) => {
        return spp.parseResponse(prod, options);
      });

      const updated = _nest.update(obj, 'ServiceProductResponse', [...mapped.filter(Boolean)]);
      this.response = updated ? updated : obj;
    } else {
      this.response = obj;
    }
    this.responseType = _nest.find(this.response, 'ResponseType');
    this.responseError = _nest.find(this.response, 'ErrorResponse');
    return this.response;
  }

  enrichData(appdata: UpdateAppDataInput | undefined): UpdateAppDataInput | undefined {
    if (!appdata) return;
    let fulfillReport;
    let fulfillMergeReport;
    let fulfillVantageScore;
    let fulfilledOn = new Date().toISOString();

    const spr = _nest.find(this.response, 'ServiceProductResponse') as
      | IFulfillServiceProductResponse
      | IFulfillServiceProductResponse[];
    const key = _nest.find(this.response, 'ServiceBundleFulfillmentKey') as string;
    if (!spr) return;
    if (spr instanceof Array) {
      fulfillReport = _.find(spr, ['ServiceProduct', 'TUCReport']);
      fulfillMergeReport = _.find(spr, ['ServiceProduct', 'MergeCreditReports']);
      fulfillVantageScore = _.find(spr, ['ServiceProduct', 'TUCVantageScore3']);
    } else {
      switch (_.get(spr, 'ServiceProduct')) {
        case 'TUCReport':
          fulfillReport = spr || null;
          break;
        case 'MergeCreditReports':
          fulfillMergeReport = spr || null;
          break;
        case 'TUCVantageScore3':
          fulfillVantageScore = spr || null;
          break;
        default:
          break;
      }
    }

    const priorReport = _nest.find(appdata, 'fulfillReport');
    const priorMergeReport = _nest.find(appdata, 'fulfillMergeReport');
    const priorVantageScore = _nest.find(appdata, 'fulfillVantageScore');

    const report = fulfillReport ? mapReportResponse(fulfillReport) : priorReport;
    const mergeReport = fulfillMergeReport ? mapReportResponse(fulfillMergeReport) : priorMergeReport;
    const vantageScore = fulfillVantageScore ? mapReportResponse(fulfillVantageScore) : priorVantageScore;

    if (!mergeReport) return appdata; // don't overwrite report if there is an error mapping...the other two are less critical
    const mapped = {
      ...appdata,
      agencies: {
        ...appdata.agencies,
        transunion: {
          ...appdata.agencies?.transunion,
          fulfilledOn: fulfilledOn,
          fulfillReport: report,
          fulfillMergeReport: mergeReport,
          fulfillVantageScore: vantageScore,
          serviceBundleFulfillmentKey: key, // this always has to be synced to the report in fulfill fields
        },
      },
    };
    this.enriched = mapped;
    return this.enriched;
  }
}
