import { ICancelEnrollResponse } from 'libs/transunion/cancel-enrollment/cancel-enrollment.interface';
import { TUResponder } from 'libs/transunion/tu/tu-responder';

export class CancelEnrollmentResponder extends TUResponder<ICancelEnrollResponse, any> {
  constructor() {
    super();
  }
}
