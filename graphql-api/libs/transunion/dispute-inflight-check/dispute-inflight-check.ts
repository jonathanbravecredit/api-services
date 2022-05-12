import * as _ from 'lodash';
import * as dayjs from 'dayjs';
import { DB } from 'libs/utils/db/db';
import { Nested as _nest } from '@bravecredit/brave-sdk';
import { IProxyRequest } from 'libs/interfaces';
import { IProxyHandlerResponse } from 'libs/interfaces/api/proxy-handler.interfaces';
import { LoggerTransactionals } from 'libs/utils/logger/LoggerTransactionals';
import { GetAlertsNotificationsV2 } from 'libs/transunion/get-alerts-notifications/get-alerts-notifications-v2';
import { GetDisputeStatusV2 } from 'libs/transunion/get-dispute-status/get-dispute-status-v2';
import { FulfillV3 } from 'libs/transunion/fulfill/fulfill-v3';
import { GetInvestigationResultsV2 } from 'libs/transunion/get-investigation-results/get-investigation-results-v2';
import {
  IGetAlertNotificationsForAllUsersResult,
  IAlertNotification,
} from 'libs/transunion/get-alerts-notifications/get-alerts-notifications.interface';
import { IGetDisputeStatusResult } from 'libs/transunion/get-dispute-status/get-dispute-status.interface';

export class DisputeInflightCheckV2 extends LoggerTransactionals {
  public db = DB;
  public results;
  public notificationResults: IProxyHandlerResponse<IGetAlertNotificationsForAllUsersResult>;
  public notifications: IAlertNotification[] = [];
  public updates: {
    success: boolean;
    error?: any;
    data?: IGetDisputeStatusResult | null;
  }[] = [];

  public successful: {
    success: boolean;
    error?: any;
    data?: IGetDisputeStatusResult | null;
  }[] = [];

  public completed: {
    success: boolean;
    error?: any;
    data?: IGetDisputeStatusResult | null;
  }[] = [];

  public alerted: any[] = [];

  constructor(protected payload: IProxyRequest, public action = 'DisputeInflightCheck') {
    super('DisputeInflightCheck');
  }

  async run(): Promise<any> {
    try {
      await this.getAlertsNotifications();
      await this.assignNotifications();
      await this.assignUpdates();
      await this.assignSuccessful();
      await this.updateDisputeStatus();
      await this.assignCompleted();
      await this.getInvestigationResults();
      this.results = { success: true, error: null, data: this.alerted };
      await this.logResults();
      return this.results;
    } catch (err) {
      console.error('INFLIGHT ERROR', err);
      this.logGenericError('alert_notification_operation', err);
      this.results = { success: false, error: err, data: null };
      return this.results;
    }
  }

  async getAlertsNotifications(): Promise<void> {
    this.notificationResults = await new GetAlertsNotificationsV2(this.payload).run();
  }

  assignNotifications(): void {
    const alert = _nest.find<IAlertNotification[] | IAlertNotification>(this.notificationResults, 'AlertNotification');
    if (!alert) return;
    this.notifications = _.castArray(alert);
    console.log('NOTIFICATIONS: ', this.notifications);
  }

  async assignUpdates(): Promise<void> {
    if (!this.notifications.length) return;
    this.updates = await Promise.all(
      this.notifications.map(async (alert) => {
        const message = JSON.stringify({ disputeId: `${alert.AlertId}` });
        const identityId = alert.ClientKey;
        const payload = _.merge(this.payload, { message, identityId });
        return await new GetDisputeStatusV2(payload).run();
      }),
    );
    console.log('UPDATES: ', JSON.stringify(this.updates));
  }

  assignSuccessful(): void {
    this.successful = this.updates.filter((d) => d.success);
    console.log('SUCCESSFUL: ', JSON.stringify(this.successful));
  }

  async updateDisputeStatus(): Promise<void> {
    if (!this.successful.length) return;
    await Promise.all(
      this.successful.map(async (item) => {
        const id = _nest.find<string>(item, 'ClientKey');
        const disputeId = _nest.find<string>(item, 'DisputeId');
        if (!id || !disputeId) await this.handleMissingIds(item);
        const currentDispute = await DB.disputes.get(id, `${disputeId}`);
        console.log('CURRENT DISPUTE', currentDispute);
        const complete = _nest.find<string>(item, 'Status').toLowerCase() === 'completedispute';
        console.log('IS COMPLETE', complete);
        const tuDate =
          _nest.find<string>(_nest.find<any>(item, 'ClosedDisputes') || {}, 'LastUpdatedDate') ||
          _nest.find<string>(_nest.find<any>(item, 'OpenDisputes') || {}, 'LastUpdatedDate');
        const closedOn = complete ? dayjs(tuDate, 'MM/DD/YYYY').toISOString() : currentDispute.closedOn;
        const mappedDispute = DB.disputes.generators.createUpdateDisputeDBRecord(item.data, closedOn);
        console.log('MAPPED', mappedDispute);
        const updatedDispute = {
          ...currentDispute,
          ...mappedDispute,
        };
        console.log('updatedDispute', updatedDispute);
        await DB.disputes.update(updatedDispute);
      }),
    );
  }

  assignCompleted(): void {
    this.completed = this.updates.filter((d) => _nest.find<string>(d, 'Status')?.toLowerCase() === 'completedispute');
    console.log('COMPLETED: ', JSON.stringify(this.completed));
  }

  async getInvestigationResults(): Promise<void> {
    if (!this.completed.length) return;
    this.alerted = await Promise.all(
      this.completed.map(async (item) => {
        try {
          const id = _nest.find<string>(item, 'ClientKey');
          const disputeId = _nest.find<string>(item, 'DisputeId');
          if (!id || !disputeId) await this.handleMissingIds(item);
          console.log('CHECKING FOR EXISTING RESULTS');
          const dispute = await DB.disputes.get(id, disputeId.toString());
          if (dispute.disputeInvestigationResults) {
            return { success: true, error: null, data: 'IR already received' };
          }
          const message = JSON.stringify({ disputeId: disputeId.toString() });
          const payload = _.merge(this.payload, { message });
          const fulfilled = await new FulfillV3(payload).run();
          if (!fulfilled.success) throw `fulfilled failed; error: ${fulfilled.error}; data: ${fulfilled.data}`;
          const synced = await new GetInvestigationResultsV2(payload).run();
          let response = synced
            ? { success: true, error: null, data: synced.data }
            : { success: false, error: 'failed to get investigation results' };
          console.log('response ===> ', response);
          return response;
        } catch (err) {
          return err;
        }
      }),
    );
  }

  async handleMissingIds(item: { success: boolean; error?: any; data?: IGetDisputeStatusResult }): Promise<void> {
    const id = _nest.find<string>(item, 'ClientKey') || 'unknown_dispute_inflight_id';
    const data = JSON.stringify(item.data);
    await this.logGenericError(id, data);
  }

  /**
   * logs the results of the API call
   */
  async logResults(): Promise<void> {
    const id = 'alert_notification_operation';
    await this.log(id, this.results, 'GENERIC');
  }
}
