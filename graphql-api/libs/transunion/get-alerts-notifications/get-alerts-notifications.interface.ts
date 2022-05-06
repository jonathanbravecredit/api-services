import { IErrorResponse, INil, IStandardResponse } from 'libs/interfaces';

export interface IGetAlertsNotificationPayload {
  RequestKey: string;
}

export interface IGetAlertsNotificationSchema {}

export interface IGetAlertsNotificationMsg {
  AccountCode: string;
  AccountName: string;
  RequestKey: string;
}

// plural
export interface IGetAlertsNotification {
  request: IGetAlertsNotificationMsg;
}

export interface IGetAlertNotificationsResponse {
  Envelope: {
    Body: {
      GetAlertNotificationsForAllUsersResponse: {
        GetAlertNotificationsForAllUsersResult: IGetAlertNotificationsForAllUsersResult;
      };
    };
  };
}

export interface IGetAlertNotificationsForAllUsersResult {
  AccountName: string;
  ErrorResponse: IErrorResponse | INil;
  RequestKey: string;
  ResponseType: string;
  AlertNotifications: {
    AlertNotification: IAlertNotification[] | IAlertNotification;
  };
  HasMoreNotifications: boolean;
}

export interface IAlertNotification {
  AlertId: string | number;
  Bureau: string;
  Channel: unknown;
  ClientKey: string;
  TrackingUUID: string;
  Type: string;
  WatchAlerts: unknown;
}
