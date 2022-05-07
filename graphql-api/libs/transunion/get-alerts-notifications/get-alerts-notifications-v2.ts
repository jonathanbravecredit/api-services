import { Nested as _nest } from '@bravecredit/brave-sdk';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { APIRequest } from 'libs/models/api-request.model';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { TUAPIProcessor } from 'libs/transunion/tu/tu-api';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { GetAlertsNotificationsResponder } from 'libs/transunion/get-alerts-notifications/subclasses/get-alerts-notifications.responder';
import { GetAlertsNotificationsRequester } from 'libs/transunion/get-alerts-notifications/subclasses/get-alerts-notifications.requester';
import {
  IGetAlertNotificationsForAllUsersResult,
  IGetAlertNotificationsResponse,
  IGetAlertsNotificationSchema,
} from 'libs/transunion/get-alerts-notifications/get-alerts-notifications.interface';
import { IProxyRequest } from 'libs/interfaces';

export class GetAlertsNotificationsV2
  extends TUAPIProcessor<
    IGetAlertsNotificationSchema,
    any,
    IGetAlertNotificationsResponse,
    IGetAlertNotificationsForAllUsersResult
  >
  implements APIRequest
{
  public action = 'GetAlertsNotifications';
  public schema = '';
  public resultKey = 'GetAlertNotificationsForAllUsersResult';
  public serviceBundleCode = '';

  constructor(protected payload: IProxyRequest) {
    super('GetAlertsNotifications', payload, new GetAlertsNotificationsResponder(), new Payloader<any>(), new SoapV2());
  }

  /**
   * Payloader runner for data prep
   *  - validate the payload against the schema
   *  - Does NOT gather GQL data if needed (must implement independently)
   * @returns
   */
  runPayloader(): void {
    this.prepped = {
      id: this.payload.identityId,
    };
  }

  /**
   * Requester runner to:
   * run the indicative enrichment request which:
   *    - accepts the payload
   *    - generates the request object
   *    - generates the request xml
   */
  runRequester(): void {
    const requester = new GetAlertsNotificationsRequester(APIRequestKeys.GET_AUTHENTICATION_QUESTIONS, this.prepped);
    this.reqXML = requester.createRequest();
    console.log('reqXML: ', this.reqXML);
  }
}
