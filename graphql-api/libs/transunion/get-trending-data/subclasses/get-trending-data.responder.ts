import { IGetTrendingDataResponse } from 'libs/transunion/get-trending-data/get-trending-data.interface';
import { TUResponder } from 'libs/transunion/tu/tu-responder';

export class GetTrendingDataResponder extends TUResponder<IGetTrendingDataResponse, any> {
  constructor() {
    super();
  }
}
