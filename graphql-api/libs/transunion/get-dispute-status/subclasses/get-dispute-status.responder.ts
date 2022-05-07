import { IGetDisputeStatusResponse } from 'libs/transunion/get-dispute-status/get-dispute-status.interface';
import { TUResponder } from 'libs/transunion/tu/tu-responder';

export class GetDisputeStatusResponder extends TUResponder<IGetDisputeStatusResponse, any> {
  constructor() {
    super();
  }
}
