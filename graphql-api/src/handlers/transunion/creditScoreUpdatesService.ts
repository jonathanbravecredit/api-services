import 'reflect-metadata';
import { AppSyncResolverEvent, AppSyncResolverHandler } from 'aws-lambda';
import { SNS, DynamoDB } from 'aws-sdk';
import ErrorLogger from 'lib/utils/db/logger/logger-errors';
import { PubSubUtil } from 'lib/utils/pubsub/pubsub';
import { IBatchMsg, IAttributeValue } from 'lib/interfaces/batch.interfaces';
import { parallelScanAppData } from 'lib/utils/db/appdata/appdata';
import { parallelScanTransactionsLog } from 'lib/utils/db/apitransactions/apitransactions';
// import { getAllEnrollmentItemsInDB } from 'lib/utils/db/dynamo-db/dynamo';
// import { IGetEnrollmentData } from 'lib/utils/db/dynamo-db/dynamo.interfaces';

// request.debug = true; import * as request from 'request';
const errorLogger = new ErrorLogger();
const sns = new SNS({ region: 'us-east-2' });
const pubsub = new PubSubUtil();
const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'us-east-2' });
const tableName = process.env.APPTABLE;
/**
 * Handler that processes single requests for Transunion services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @returns Lambda proxy response
 */
export const main: AppSyncResolverHandler<any, any> = async (event: AppSyncResolverEvent<any>): Promise<any> => {
  try {
    let counter = 0;
    const segments = [];
    for (let i = 0; i < 128; i++) {
      segments.push(i);
    }
    await Promise.all(
      segments.map(async (s) => {
        let params = {
          TableName: 'APITransactionLog', //tableName, // using trans log as test case
          exclusiveStartKey: undefined,
          segment: s,
          totalSegments: segments.length,
        };
        let items;
        let counter: number = 0;
        do {
          items = await parallelScanTransactionsLog(params.exclusiveStartKey, params.segment, params.totalSegments);
          // items = await parallelScanAppData(params.exclusiveStartKey, params.segment, params.totalSegments);
          console.log(`segment: ${s} of total segments: ${segments.length}...counter: ${counter}`);
          await Promise.all(
            items.Items.map(async (item) => {
              await new Promise((res, rej) => {
                setTimeout(() => {
                  res(null);
                }, 20);
              });
              counter++;
              // if (item.agencies?.transunion?.enrolled) {
              // const enrollee = {
              //   id: item.id,
              //   user: item.user,
              //   agencies: {
              //     transunion: {
              //       enrollmentKey: item.agencies?.transunion?.enrollmentKey,
              //       serviceBundleFulfillmentKey: item.agencies?.transunion?.serviceBundleFulfillmentKey,
              //     },
              //   },
              // };

              // COMMENTED OUT FOR TESTING
              // const payload = pubsub.createSNSPayload<{ id: string }>(
              //   'creditscoreupdates',
              //   enrollee,
              //   'creditscoreupdates',
              // );
              // await sns.publish(payload).promise();
              // counter++;
              // }
            }),
          );
          params['ExclusiveStartKey'] = items.LastEvaluatedKey;
        } while (typeof items.LastEvaluatedKey != 'undefined');
      }),
    );
    const results = { success: true, error: null, data: `Ops:batch queued ${counter} records.` };
    return JSON.stringify(results);
  } catch (err) {
    console.log('err ===> ', err);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  }
};
