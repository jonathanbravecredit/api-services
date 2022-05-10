import { IProxyRequest } from 'libs/interfaces/api/proxy-query.interfaces';
import { FulfillV3 } from 'libs/transunion/fulfill/fulfill-v3';
import { FulfillRequester } from 'libs/transunion/fulfill/subclasses/fulfill.requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';

export class FulfillDisputesV3 extends FulfillV3 {
  public action = 'FulfillDisputes';
  public serviceBundleCode = 'CC2BraveCreditTUReport24Hour';
  constructor(protected payload: IProxyRequest) {
    super(payload, 'FulfillDisputes');
  }

  /**
   * Requester runner to:
   *  - generate the request (map to TU datastructure)
   *  - generate the XML
   * @returns
   */
  runRequester(): void {
    this.formatDob();
    const requester = new FulfillRequester(APIRequestKeys.FULFILL_DISPUTE, {
      ...this.gqldata,
      serviceBundleCode: this.serviceBundleCode,
    });
    this.reqXML = requester.createRequest();
    console.log('reqXML: ', this.reqXML);
  }
}
