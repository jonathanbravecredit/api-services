import { MOCK_CONFIG } from 'libs/examples/mocks/Config';

export const GET_ALERT_NOTIFICATIONS_RESPONSE = {
  Envelope: {
    Body: {
      GetAlertNotificationsForAllUsersResponse: {
        GetAlertNotificationsForAllUsersResult: {
          AccountName: 'CC2BraveCredit',
          ErrorResponse: {
            nil: true,
          },
          RequestKey: 'BC-103e51c1-c7d9-4868-8c93-45a39f403d2b',
          ResponseType: 'Success',
          AlertNotifications: {
            AlertNotification: [
              {
                AlertId: MOCK_CONFIG.disputeId,
                Bureau: 'TransUnion',
                Channel: {
                  nil: true,
                },
                ClientKey: MOCK_CONFIG.userId,
                TrackingUUID: 'c113e082-24c9-406e-9d77-170f3e42d792',
                Type: 'Dispute',
                WatchAlerts: {
                  nil: true,
                },
              },
              {
                AlertId: 6932,
                Bureau: 'TransUnion',
                Channel: {
                  nil: true,
                },
                ClientKey: '265ffe96-3b66-41a8-bc29-70cf5ddd6355',
                TrackingUUID: '2c9c76c3-1b4b-4454-aa45-9eb2a8758ad5',
                Type: 'Dispute',
                WatchAlerts: {
                  nil: true,
                },
              },
            ],
          },
          HasMoreNotifications: false,
        },
      },
    },
  },
};
