import 'reflect-metadata';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { Agent } from 'https';
import { readFileSync } from 'fs';
import { CancelEnroll } from 'libs/proxy';
import { getSecretKey } from 'libs/utils/secrets/secrets';
import { DB } from 'libs/utils/db/db';
import ErrorLogger from 'libs/utils/db/logger/logger-errors';
import TransactionLogger from 'libs/utils/db/logger/logger-transactions';
import { IFulfillResult, IProxyRequest, ITransunionBatchPayload } from 'libs/interfaces';
import { IGetEnrollmentData } from 'libs/utils/db/dynamo-db/dynamo.interfaces';
import { TransunionUtil as TU } from 'libs/utils/transunion/transunion';
import { FulfillV3 } from 'libs/transunion/fulfill/fulfill-v3';
import { Nested as _nest } from 'libs/utils/helpers/Nested';

// request.debug = true; import * as request from 'request';
const errorLogger = new ErrorLogger();
const transactionLogger = new TransactionLogger();

const transunionSKLoc = process.env.TU_SECRET_LOCATION;
const tuEnv = process.env.TU_ENV;
let key: Buffer;
let cert: Buffer;
let cacert: Buffer;
let username = 'CC2BraveCredit';
let accountCode = 'M2RVc0ZZM0Rwd2FmZA';
// let message;
let user;
let auth;
let passphrase;
let password;

/**
 * Handler that processes single requests for Transunion services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @returns Lambda proxy response
 */
export const main: SQSHandler = async (event: SQSEvent): Promise<any> => {
  // prep work
  try {
    const secretJSON = await getSecretKey(transunionSKLoc);
    const { tuKeyPassphrase, tuPassword } = JSON.parse(secretJSON);
    password = tuPassword;
    passphrase = tuKeyPassphrase;
    user = `${username}:${password}`;
    auth = 'Basic ' + Buffer.from(user).toString('base64');
  } catch (err) {
    const error = errorLogger.createError('credit_score_updates_operation', 'get_secrets_failure', JSON.stringify(err));
    errorLogger.logger.create(error);
    return { success: false, error: { error: `Error gathering/reading secrets=${err}` } };
  }
  // prep work
  try {
    const prefix = tuEnv === 'dev' ? 'dev' : 'prod';
    key = readFileSync(`/opt/${prefix}-tubravecredit.key`);
    cert = readFileSync(`/opt/${prefix}-brave.credit.crt`);
    cacert = readFileSync(`/opt/${prefix}-Root-CA-Bundle.crt`);
  } catch (err) {
    const error = errorLogger.createError(
      'credit_score_updates_operation',
      'get_certificates_failure',
      JSON.stringify(err),
    );
    errorLogger.logger.create(error);
    return { success: false, error: { error: `Error gathering/reading cert=${err}` } };
  }

  /*==========================================*/
  //       CREDIT SCORE UPDATES WORKER
  /*==========================================*/
  // single batch worker handles all the requests
  const creditScoreUpdate = event.Records.map((r) => {
    return JSON.parse(r.body) as ITransunionBatchPayload<IGetEnrollmentData>;
  }).filter((b) => {
    return b.service === 'creditscoreupdates';
  });
  console.log(`Received ${creditScoreUpdate.length} creditscoreupdates records `);

  if (creditScoreUpdate.length) {
    try {
      const httpsAgent = new Agent({
        key,
        cert,
        passphrase,
      });
      let counter = 0;
      const resp = await Promise.all(
        creditScoreUpdate.map(async (rec) => {
          const identityId = rec.message.id;
          const payload: IProxyRequest = {
            accountCode,
            username,
            message: JSON.stringify(rec.message),
            agent: httpsAgent,
            auth,
            identityId,
          }; // don't pass the agent in the queue;
          // a special version of fulfill that calls TU API but updates the DB more directly for better performance
          const fulfill = new FulfillV3(payload);
          const { success } = await fulfill.run();
          const resp = fulfill.response;
          const result = _nest.find<IFulfillResult>(resp, 'FulfillResult');
          if (success && result) {
            const prodResponse = result.ServiceProductFulfillments.ServiceProductResponse; //returnNestedObject<any>(fulfill, 'ServiceProductResponse');
            if (!prodResponse) return;
            // get the last score tracked
            const score = await DB.creditScoreTrackings.get(payload.identityId, 'transunion');
            // get the current score from the fulfill response and note the delta
            const newScore = TU.parseProductResponseForScoreTracking(prodResponse, score);
            // ave record to database and move to next record.
            if (newScore !== null) {
              await DB.creditScoreTrackings.update(newScore);
            }
            counter++;
          }
          return rec;
        }),
      );
      const results = {
        success: true,
        error: null,
        data: `Transunion credit score updates worker successfully processed ${counter} records`,
      };
      console.log(JSON.stringify(results));
      return JSON.stringify(results);
    } catch (err) {
      const error = errorLogger.createError('credit_score_updates_system', 'unknown_server_error', JSON.stringify(err));
      await errorLogger.logger.create(error);
      return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
    }
  }

  /*==========================================*/
  //       CANCEL ENROLLMENTS WORKER
  /*==========================================*/
  const cancelEnrollment = event.Records.map((r) => {
    return JSON.parse(r.body) as ITransunionBatchPayload<{ id: string }>;
  }).filter((b) => {
    return b.service === 'cancelenrollment';
  });
  console.log(`Received ${cancelEnrollment.length} cancelEnrollment records `);

  if (cancelEnrollment.length) {
    try {
      const httpsAgent = new Agent({
        key,
        cert,
        passphrase,
      });
      let counter = 0;
      const resp = await Promise.all(
        cancelEnrollment.map(async (rec) => {
          const identityId = rec.message.id;
          const payload: IProxyRequest = {
            accountCode,
            username,
            message: JSON.stringify({}),
            agent: httpsAgent,
            auth,
            identityId,
          }; // don't pass the agent in the queue;
          const cancel = await CancelEnroll(payload);
          const { success } = cancel;
          if (success) {
            counter++;
          }
          return rec;
        }),
      );
      const results = {
        success: true,
        error: null,
        data: `Transunion cancel enroll worker successfully processed ${counter} records`,
      };
      console.log(JSON.stringify(results));
      return JSON.stringify(results);
    } catch (err) {
      const error = errorLogger.createError(
        'cancel_enroll_updates_system',
        'unknown_server_error',
        JSON.stringify(err),
      );
      await errorLogger.logger.create(error);
      return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
    }
  }
};
