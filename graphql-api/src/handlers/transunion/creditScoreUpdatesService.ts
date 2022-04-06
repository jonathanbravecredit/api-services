import 'reflect-metadata';
import { AppSyncResolverEvent, AppSyncResolverHandler } from 'aws-lambda';
import { SNS, DynamoDB } from 'aws-sdk';
import ErrorLogger from 'lib/utils/db/logger/logger-errors';
import { PubSubUtil } from 'lib/utils/pubsub/pubsub';
import { IBatchMsg } from 'lib/interfaces/batch.interfaces';
import { parallelScanAppDataEnrollKeys } from 'lib/utils/db/appdata/appdata';
import { TransactionData, TransactionDataMaker, TransactionDataQueries } from '@bravecredit/brave-sdk';
import * as dayjs from 'dayjs';
// import { getAllEnrollmentItemsInDB } from 'lib/utils/db/dynamo-db/dynamo';
// import { IGetEnrollmentData } from 'lib/utils/db/dynamo-db/dynamo.interfaces';

// request.debug = true; import * as request from 'request';
const errorLogger = new ErrorLogger();
const sns = new SNS({ region: 'us-east-2' });
const pubsub = new PubSubUtil();
const trans = TransactionDataQueries;
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
    const segments = [];
    for (let i = 0; i < 128; i++) {
      segments.push(i);
    }
    await Promise.all(
      segments.map(async (s, i) => {
        let params = {
          exclusiveStartKey: undefined,
          segment: s,
          totalSegments: segments.length,
        };
        let items: IBatchMsg<DynamoDB.DocumentClient.Key> | undefined;
        let counter: number = 0;
        do {
          items = await parallelScanAppDataEnrollKeys(params.exclusiveStartKey, params.segment, params.totalSegments);
          await Promise.all(
            items.items.map(async (item) => {
              //check is processed
              try {
                const processed = await wasProcessed(item.id, 'credit_service_trx')
                if (processed) return;
                const ttl = dayjs(new Date()).add(24, 'hours').valueOf() / 1000; // set ttl for 24hours and in seconds
                const trx = new TransactionDataMaker(item.id, 'credit_service_trx', ttl)
                await trans.createTransaction(trx);
                await parseAndPublish(item);
                counter++;
              } catch (err) {
                console.error(err);
              }
            }),
          );
          params.exclusiveStartKey = items.lastEvaluatedKey;
        } while (typeof items.lastEvaluatedKey != 'undefined');
        console.log(`segment: ${s} of total segments: ${segments.length}...processed: ${counter}`);
      }),
    );
    const results = { success: true, error: null, data: `Ops:batch queued records.` };
    return JSON.stringify(results);
  } catch (err) {
    console.log('err ===> ', err);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  }
};

type CreditServiceTransaction = 'credit_service_trx';

const parseAndPublish = async (item) => {
  if (item.agencies?.transunion?.enrolled) {
    const enrollee = {
      id: item.id,
      user: item.user,
      agencies: {
        transunion: {
          enrollmentKey: item.agencies?.transunion?.enrollmentKey,
          serviceBundleFulfillmentKey: item.agencies?.transunion?.serviceBundleFulfillmentKey,
        },
      },
    };
    const payload = pubsub.createSNSPayload<{ id: string }>('creditscoreupdates', enrollee, 'creditscoreupdates');
    await sns.publish(payload).promise();
  }
};

const wasProcessed = async (id: string, sortKey: CreditServiceTransaction): Promise<boolean> => {
  try {
    const trx: TransactionData | null = await trans.getTransaction(id, sortKey);
    return !!trx;
  } catch (err) {
    console.error(err);
  }
}
