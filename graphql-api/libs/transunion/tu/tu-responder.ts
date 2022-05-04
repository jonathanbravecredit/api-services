import * as fastXml from 'fast-xml-parser';

/**
 * T = Data object (i.e AppData)
 * R = Request form
 */
export class TUResponder<RES, U> {
  public xml: string;
  public response: RES;
  public enriched: U = null;

  constructor() {}

  parseResponse(options: any): RES {
    if (!this.xml) throw 'No XML set';
    const obj: RES = fastXml.parse(this.xml, options);
    this.response = obj;
    console.log('response: ', JSON.stringify(this.response));
    return this.response;
  }

  enrichData(arg: U | undefined): U | undefined {
    return this.enriched;
  }
}
