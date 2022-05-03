import 'reflect-metadata';
import { Handler } from 'aws-lambda';
import { listTransactionLog } from 'libs/utils/db/logger/queries/api-transaction.queries';
import { Sync } from 'libs/utils/sync/sync';
import * as tu from 'libs/transunion';
import { IFulfillResult } from 'libs/interfaces';

export const main: Handler = async (event: any): Promise<void> => {
  const { list } = event as { list: string[] }; // list of failed fulfill IDs
  if (!list || !list.length) return;
  // get the FulfillWorker:data action from transaction logs
  try {
    await Promise.all(
      list.map(async (id) => {
        const actions = (await listTransactionLog(id))
          .filter((log) => log.action === 'FulfillWorker:data')
          .sort((a, b) => {
            return new Date(b.createdOn).valueOf() - new Date(a.createdOn).valueOf();
          })[0];
        if (!actions) return;
        const data = JSON.parse(actions.transaction) as IFulfillResult;
        const timestamp = '2022-01-19T08:00:00.000Z';
        // update the data base with the parsed results;
        const sync = new Sync(tu.enrichFulfillData);
        // get the specific response from parsed object
        const responseType = data?.ResponseType;
        const error = data?.ErrorResponse;

        let response;
        if (responseType.toLowerCase() === 'success') {
          const synced = await sync.syncData({ id }, data, false);
          response = synced
            ? { success: true, error: null, data: data }
            : { success: false, error: 'failed to sync data to db' };
        } else {
          response = { success: false, error: error };
        }
      }),
    );
  } catch (err) {}
  return;
};
