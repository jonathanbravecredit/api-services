import 'reflect-metadata';
import { AppSyncResolverEvent, AppSyncResolverHandler } from 'aws-lambda';
import { SNS, DynamoDB } from 'aws-sdk';
import ErrorLogger from 'lib/utils/db/logger/logger-errors';
import { PubSubUtil } from 'lib/utils/pubsub/pubsub';
import { DEV_FAILED_FULFILLS, FAILED_FULFILLS } from 'lib/data/failedfulfills';
import { getItemsInDB } from 'lib/utils/db/dynamo-db/dynamo';
import { CANCEL_ENROLLMENTS } from 'lib/data/cancelEnrollments';
// import { getAllEnrollmentItemsInDB } from 'lib/utils/db/dynamo-db/dynamo';
// import { IGetEnrollmentData } from 'lib/utils/db/dynamo-db/dynamo.interfaces';

// request.debug = true; import * as request from 'request';
const errorLogger = new ErrorLogger();
const sns = new SNS({ region: 'us-east-2' });
const pubsub = new PubSubUtil();
const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'us-east-2' });
const tableName = process.env.APPTABLE;

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
export const main: AppSyncResolverHandler<any, any> = async (event: AppSyncResolverEvent<any>): Promise<any> => {
  // can be kicked off through AppSync if needed
  // const scores = await DB.creditScoreTrackings.list();
  // create the payload with out the auth and agent
  try {
    const appItems = await Promise.all(
      CANCEL_ENROLLMENTS.map(async (id) => {
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
          const payload = pubsub.createSNSPayload<IEnrollee>('creditscoreupdates', enrollee, 'cancelenrollment');
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
