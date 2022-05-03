/**
 * T = Data object (i.e AppData)
 * R = Request form
 */
export class TUResponseBase<RES, U> {
  public response: RES;
  public responseType: string;
  public responseError: any;
  public xml: string;
  public enriched: U;

  constructor() {}

  parseResponse(arg: any): RES {
    return this.response;
  }
  enrichData(arg: U | undefined): U | undefined {
    return this.enriched;
  }
}
