import 'reflect-metadata';
import { SNS } from 'aws-sdk';
import { Handler } from 'aws-lambda';
import { PubSubUtil } from 'lib/utils/pubsub/pubsub';
import ErrorLogger from 'lib/utils/db/logger/logger-errors';

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
export const main: Handler = async (event: any): Promise<any> => {
  // can be kicked off through AppSync if needed
  // const scores = await DB.creditScoreTrackings.list();
  // create the payload with out the auth and agent
  const { list } = event;
  if (!list && !list.length) {
    console.log('no list provided');
  }

  try {
    let counter = 0;
    await Promise.all(
      list.map(async (id) => {
        const enrollee: { id: string } = { id };
        const payload = pubsub.createSNSPayload<{ id: string }>('cancelenrollment', enrollee, 'cancelenrollment');
        const res = await sns.publish(payload).promise();
        counter++;
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
