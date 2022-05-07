import * as _ from 'lodash';
import { TUResponder } from 'libs/transunion/tu/tu-responder';
import { IEnrollResponse } from 'libs/transunion/enroll/enroll.interface';
import { UpdateAppDataInput, Nested as _nest } from '@bravecredit/brave-sdk';

export class EnrollDisputeResponder extends TUResponder<IEnrollResponse, any> {
  constructor() {
    super();
  }

  enrichData(appdata: UpdateAppDataInput | undefined): UpdateAppDataInput | undefined {
    if (!appdata) return;
    let enrolledOn = new Date().toISOString();
    const eKey = _nest.find<string>(this.response, 'EnrollmentKey');
    const fKey = _nest.find<string>(this.response, 'ServiceBundleFulfillmentKey');
    const mapped = {
      agencies: {
        transunion: {
          disputeEnrolled: true,
          disputeEnrolledOn: enrolledOn,
          disputeEnrollmentKey: eKey,
          disputeServiceBundleFulfillmentKey: fKey,
        },
      },
    };
    const merged = _.merge(appdata, mapped);
    this.enriched = merged;
    return this.enriched;
  }
}
