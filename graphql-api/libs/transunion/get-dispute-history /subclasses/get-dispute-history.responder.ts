import { IGetDisputeHistoryResponse } from 'libs/transunion/get-dispute-history /get-dispute-history.interface';
import { TUResponder } from 'libs/transunion/tu/tu-responder';

export class GetDisputeHistoryResponder extends TUResponder<IGetDisputeHistoryResponse, any> {
  constructor() {
    super();
  }
}
