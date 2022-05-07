import { IProxyRequest } from 'libs/interfaces/api/proxy-query.interfaces';
import { FulfillV3 } from 'libs/transunion/fulfill/fulfill-v3';

export class FulfillDisputesV3 extends FulfillV3 {
  public action = 'FulfillDisputes';
  public serviceBundleCode = 'CC2BraveCreditTUReportV3Score';
  constructor(protected payload: IProxyRequest) {
    super(payload, 'FulfillDisputes');
  }
}
