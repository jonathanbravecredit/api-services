import { IGetAlertNotificationsResponse } from 'libs/transunion/get-alerts-notifications/get-alerts-notifications.interface';
import { TUResponder } from 'libs/transunion/tu/tu-responder';

export class GetAlertsNotificationsResponder extends TUResponder<IGetAlertNotificationsResponse, any> {
  constructor() {
    super();
  }
}
