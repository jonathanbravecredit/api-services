import 'reflect-metadata';
import ErrorLogger from 'libs/utils/db/logger/logger-errors';
import { SNS } from 'aws-sdk';
import { Handler } from 'aws-lambda';
import { PubSubUtil } from 'libs/utils/pubsub/pubsub';
import { getItemsInDB } from 'libs/utils/db/dynamo-db/dynamo';

const errorLogger = new ErrorLogger();
const sns = new SNS({ region: 'us-east-2' });
const pubsub = new PubSubUtil();

interface IEnrollee {
  id: string;
  user: any;
  agencies: {
    transunion: {
      enrollmentKey: string;
      serviceBundleFulfillmentKey: string;
    };
  };
}
/**
 * Handler that processes single requests for Transunion services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @returns Lambda proxy response
 */
export const main: Handler = async (event: { list: string[] }): Promise<any> => {
  // can be kicked off through AppSync if needed
  // const scores = await DB.creditScoreTrackings.list();
  // create the payload with out the auth and agent
  const { list } = event;
  if (!list || !list.length) return;

  try {
    const appItems = await Promise.all(
      list.map(async (id) => {
        return await getItemsInDB(id);
      }),
    );
    let counter = 0;
    await Promise.all(
      appItems.map(async (item) => {
        if (item.Item?.agencies?.transunion?.enrolled) {
          const enrollee: IEnrollee = {
            id: item.Item.id,
            user: item.Item.user,
            agencies: {
              transunion: {
                enrollmentKey: item.Item.agencies?.transunion?.enrollmentKey,
                serviceBundleFulfillmentKey: item.Item.agencies?.transunion?.serviceBundleFulfillmentKey,
              },
            },
          };
          const payload = pubsub.createSNSPayload<IEnrollee>('creditscoreupdates', enrollee, 'creditscoreupdates');
          await sns.publish(payload).promise();
          counter++;
        }
      }),
    );
    const results = { success: true, error: null, data: `Tranunion:batch queued ${counter} records.` };
    return JSON.stringify(results);
  } catch (err) {
    const error = errorLogger.createError('credit_score_updates_system', 'unknown_server_error', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  }
};
