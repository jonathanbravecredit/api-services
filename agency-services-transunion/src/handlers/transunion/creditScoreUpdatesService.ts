import 'reflect-metadata';
import { AppSyncResolverEvent, AppSyncResolverHandler } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import ErrorLogger from 'lib/utils/db/logger/logger-errors';
import { PubSubUtil } from 'lib/utils/pubsub/pubsub';
import { getAllEnrollmentItemsInDB } from 'lib/utils/db/dynamo-db/dynamo';

// request.debug = true; import * as request from 'request';
const errorLogger = new ErrorLogger();
const sns = new SNS({ region: 'us-east-2' });
const pubsub = new PubSubUtil();
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
    const enrolled = await getAllEnrollmentItemsInDB();
    // step 2. going through each record, call fulfill (regardless of last time that the user called fulfill in the app)
    await Promise.all(
      enrolled.slice(0, 5).map(async (enrollee) => {
        // step 2b. query for the users credit score record
        const payload = pubsub.createSNSPayload<{ id: string }>('creditscoreupdates', enrollee, 'transunionbatch');
        await sns.publish(payload).promise();
      }),
    );
    const results = { success: true, error: null, data: `Tranunion:batch queued ${enrolled.length} records.` };
    return JSON.stringify(results);
  } catch (err) {
    const error = errorLogger.createError('credit_score_updates_system', 'unknown_server_error', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  }
};
