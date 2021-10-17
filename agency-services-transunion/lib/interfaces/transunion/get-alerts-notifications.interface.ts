export interface IGetAlertsNotificationPayload {
  RequestKey: string;
}

export interface IGetAlertsNotificationMsg {
  AccountCode: string;
  AccountName: string;
  RequestKey: string;
}

// plural
export interface IGetAlertsNotification {
  request: IGetAlertsNotificationMsg;
}

export interface IGetAlertNotificationsResponse {}
