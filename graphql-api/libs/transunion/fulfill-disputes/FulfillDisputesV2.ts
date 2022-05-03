import { IProxyRequest } from 'libs/interfaces/api/proxy-query.interfaces';
import { FulfillV2 } from 'libs/transunion/fulfill/Fulfillv2';
import { FulfillRequester } from 'libs/transunion/fulfill/subclasses/FulfillRequester';

export class FulfillDisputesV2 extends FulfillV2 {
  constructor(protected payload: IProxyRequest) {
    super(payload);
    this.serviceBundleCode = 'CC2BraveCreditTUReport24Hour';
  }

  /**
   * Requester runner to:
   *  - generate the request (map to TU datastructure)
   *  - generate the XML
   * @param requester
   * @returns
   */
  runRequester<T extends FulfillRequester>(requester: T): string {
    const disputing = true;
    requester.generateRequest(disputing);
    requester.generateXML();
    const { xml } = requester;
    this.reqXML = xml;
    return this.reqXML;
  }
}
