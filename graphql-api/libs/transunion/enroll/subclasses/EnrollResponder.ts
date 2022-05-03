import * as fastXml from 'fast-xml-parser';
import * as _ from 'lodash';
import { Nested as _nest } from 'libs/utils/helpers/Nested';
import { mapReportResponse } from 'libs/utils/helpers/helpers';
import { IEnrollResponse, IEnrollServiceProductResponse, IMergeReport } from 'libs/interfaces';
import { TUReportResponseInput, UpdateAppDataInput } from 'src/api/api.service';
import { TUResponseBase } from 'libs/transunion/tu/TUResponseBase';
import { ServiceProductParser as spp } from 'libs/transunion/parsers/ServiceProductParser';
import { MergeReport } from 'libs/models/MergeReport/MergeReport';

export class EnrollResponder extends TUResponseBase<IEnrollResponse, UpdateAppDataInput> {
  public mergeReport: MergeReport;
  public mergeReportSPO: string;

  constructor() {
    super();
  }

  parseResponse(options: any): IEnrollResponse {
    if (!this.xml) throw 'No XML set';
    const obj: IEnrollResponse = fastXml.parse(this.xml, options);
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
    return this.response;
  }

  enrichData(appdata: UpdateAppDataInput | undefined): UpdateAppDataInput | undefined {
    console.log('appData', appdata);
    if (!appdata) return;
    let enrollMergeReport;
    let enrollVantageScore;
    let enrolledOn = new Date().toISOString();

    const eKey = _nest.find<string>(this.response, 'EnrollmentKey');
    const fKey = _nest.find<string>(this.response, 'ServiceBundleFulfillmentKey');
    const spr = _nest.find<IEnrollServiceProductResponse[] | IEnrollServiceProductResponse>(
      this.response,
      'ServiceProductResponse',
    );

    if (!spr) return;
    if (spr instanceof Array) {
      enrollMergeReport = _.find(spr, ['ServiceProduct', 'MergeCreditReports']);
      enrollVantageScore = _.find(spr, ['ServiceProduct', 'TUCVantageScore3']);
    } else {
      switch (spr.ServiceProduct) {
        case 'MergeCreditReports':
          enrollMergeReport = spr || null;
          break;
        case 'TUCVantageScore3':
          enrollVantageScore = spr || null;
          break;
        default:
          break;
      }
    }

    this.setMergeReport(mapReportResponse(enrollMergeReport));
    this.setMergeReportSPO(mapReportResponse(enrollMergeReport));

    // TODO eventually need to write score to either score table or report table
    const mapped = {
      ...appdata,
      agencies: {
        ...appdata.agencies,
        transunion: {
          ...appdata.agencies?.transunion,
          enrolled: true,
          enrolledOn: enrolledOn,
          enrollmentKey: eKey,
          enrollVantageScore: mapReportResponse(enrollVantageScore),
          fulfilledOn: enrolledOn,
          fulfillVantageScore: mapReportResponse(enrollVantageScore),
          serviceBundleFulfillmentKey: fKey, // this always has to be synced to the report in fulfill fields
        },
      },
    };
    this.enriched = mapped;
    return this.enriched;
  }

  setMergeReport(input: TUReportResponseInput) {
    const { serviceProductObject: spo } = input;
    this.mergeReport = new MergeReport(JSON.parse(spo));
  }

  setMergeReportSPO(input: TUReportResponseInput) {
    const { serviceProductObject: spo } = input;
    this.mergeReportSPO = spo;
  }
}
