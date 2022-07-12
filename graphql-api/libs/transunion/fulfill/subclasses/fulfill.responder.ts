import * as fastXml from "fast-xml-parser";
import * as _ from "lodash";
import { Nested as _nest } from "@bravecredit/brave-sdk";
import { TUResponder } from "libs/transunion/tu/tu-responder";
import { mapReportResponse } from "libs/utils/helpers/helpers";
import { TUReportResponseInput, UpdateAppDataInput } from "src/api/api.service";
import { ServiceProductParser as spp } from "libs/transunion/parsers/ServiceProductParser";
import { IFulfillResponse, IFulfillServiceProductResponse } from "libs/transunion/fulfill/fulfill.interface";
import { MergeReport } from "@bravecredit/brave-sdk";

export class FulfillResponder extends TUResponder<IFulfillResponse, UpdateAppDataInput> {
  public mergeReport: MergeReport;
  public mergeReportSPO: string;

  constructor() {
    super();
  }

  parseResponse(options: any): IFulfillResponse {
    if (!this.xml) throw "No XML set";
    const obj: IFulfillResponse = fastXml.parse(this.xml, options);
    const spr = _nest.find(obj, "ServiceProductResponse");
    if (!spr) throw "No response found";
    if (spr instanceof Array) {
      const mapped = spr.map((prod) => {
        return spp.parseResponse(prod, options);
      });
      const updated = _nest.update(obj, "ServiceProductResponse", [...mapped.filter(Boolean)]);
      this.response = updated ? updated : obj;
    } else {
      this.response = obj;
    }
    return this.response;
  }

  enrichData(appdata: UpdateAppDataInput | undefined): UpdateAppDataInput | undefined {
    if (!appdata) return;
    let fulfillMergeReport;
    let fulfillVantageScore;
    let fulfilledOn = new Date().toISOString();
    console.log("this.response in enrich: ", JSON.stringify(this.response));
    const spr = _nest.find(this.response, "ServiceProductResponse") as
      | IFulfillServiceProductResponse
      | IFulfillServiceProductResponse[];
    const key = _nest.find(this.response, "ServiceBundleFulfillmentKey") as string;
    console.log("spr in enrich: ", JSON.stringify(spr));
    console.log("key in enrich: ", JSON.stringify(key));

    if (!spr) return;
    if (spr instanceof Array) {
      fulfillMergeReport = _.find(spr, ["ServiceProduct", "MergeCreditReports"]);
      fulfillVantageScore = _.find(spr, ["ServiceProduct", "TUCVantageScore3"]);
    } else {
      switch (_.get(spr, "ServiceProduct")) {
        case "MergeCreditReports":
          fulfillMergeReport = spr || null;
          break;
        case "TUCVantageScore3":
          fulfillVantageScore = spr || null;
          break;
        default:
          break;
      }
    }

    if (!fulfillMergeReport) throw "No merge report found";
    this.setMergeReport(mapReportResponse(fulfillMergeReport));
    this.setMergeReportSPO(mapReportResponse(fulfillMergeReport));

    const priorVantageScore = _nest.find(appdata, "fulfillVantageScore");
    const vantageScore = fulfillVantageScore ? mapReportResponse(fulfillVantageScore) : priorVantageScore;
    // TODO eventually need to write score to either score table or report table
    const mapped = {
      ...appdata,
      agencies: {
        ...appdata.agencies,
        transunion: {
          ...appdata.agencies?.transunion,
          fulfilledOn: fulfilledOn,
          fulfillVantageScore: vantageScore,
          serviceBundleFulfillmentKey: key, // this always has to be synced to the report in fulfill fields
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
