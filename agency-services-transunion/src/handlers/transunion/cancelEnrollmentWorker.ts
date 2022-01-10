import 'reflect-metadata';
import { SQSEvent, SQSHandler } from 'aws-lambda';
// import { Agent } from 'https';
// import { readFileSync } from 'fs';
// import { FulfillWorker } from 'lib/proxy';
// import { getSecretKey } from 'lib/utils/secrets/secrets';
// import { DB } from 'lib/utils/db/db';
// import ErrorLogger from 'lib/utils/db/logger/logger-errors';
// import TransactionLogger from 'lib/utils/db/logger/logger-transactions';
// import { IProxyRequest, ITransunionBatchPayload } from 'lib/interfaces';
// import { IGetEnrollmentData } from 'lib/utils/db/dynamo-db/dynamo.interfaces';
// import { TransunionUtil as TU } from 'lib/utils/transunion/transunion';

// // request.debug = true; import * as request from 'request';
// const errorLogger = new ErrorLogger();
// const transactionLogger = new TransactionLogger();

// const transunionSKLoc = process.env.TU_SECRET_LOCATION;
// const tuEnv = process.env.TU_ENV;
// let key: Buffer;
// let cert: Buffer;
// let cacert: Buffer;
// let username = 'CC2BraveCredit';
// let accountCode = 'M2RVc0ZZM0Rwd2FmZA';
// // let message;
// let user;
// let auth;
// let passphrase;
// let password;

/**
 * Handler that processes single requests for Transunion services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @returns Lambda proxy response
 */
export const main: SQSHandler = async (event: SQSEvent): Promise<any> => {
  console.log('event ===> ', event);
  // prep work
  // try {
  //   const secretJSON = await getSecretKey(transunionSKLoc);
  //   const { tuKeyPassphrase, tuPassword } = JSON.parse(secretJSON);
  //   password = tuPassword;
  //   passphrase = tuKeyPassphrase;
  //   user = `${username}:${password}`;
  //   auth = 'Basic ' + Buffer.from(user).toString('base64');
  // } catch (err) {
  //   const error = errorLogger.createError('credit_score_updates_operation', 'get_secrets_failure', JSON.stringify(err));
  //   errorLogger.logger.create(error);
  //   return { success: false, error: { error: `Error gathering/reading secrets=${err}` } };
  // }
  // // prep work
  // try {
  //   const prefix = tuEnv === 'dev' ? 'dev' : 'prod';
  //   key = readFileSync(`/opt/${prefix}-tubravecredit.key`);
  //   cert = readFileSync(`/opt/${prefix}-brave.credit.crt`);
  //   cacert = readFileSync(`/opt/${prefix}-Root-CA-Bundle.crt`);
  // } catch (err) {
  //   const error = errorLogger.createError(
  //     'credit_score_updates_operation',
  //     'get_certificates_failure',
  //     JSON.stringify(err),
  //   );
  //   errorLogger.logger.create(error);
  //   return { success: false, error: { error: `Error gathering/reading cert=${err}` } };
  // }

  // try {
  //   const records = event.Records.map((r) => {
  //     return JSON.parse(r.body) as ITransunionBatchPayload<IGetEnrollmentData>;
  //   });
  //   console.log(`Received ${records.length} records `);
  //   const httpsAgent = new Agent({
  //     key,
  //     cert,
  //     passphrase,
  //   });
  //   let counter = 0;
  //   const resp = await Promise.all(
  //     records.map(async (rec) => {
  //       const identityId = rec.message.id;
  //       const payload: IProxyRequest = {
  //         accountCode,
  //         username,
  //         message: JSON.stringify(rec.message),
  //         agent: httpsAgent,
  //         auth,
  //         identityId,
  //       }; // don't pass the agent in the queue;
  //       // a special version of fulfill that calls TU API but updates the DB more directly for better performance
  //       const fulfill = await FulfillWorker(payload);
  //       const { success } = fulfill;
  //       if (success) {
  //         const prodResponse = fulfill.data?.ServiceProductFulfillments.ServiceProductResponse; //returnNestedObject<any>(fulfill, 'ServiceProductResponse');
  //         if (!prodResponse) return;
  //         // get the last score tracked
  //         const score = await DB.creditScoreTrackings.get(payload.identityId, 'transunion');
  //         // get the current score from the fulfill response and note the delta
  //         const newScore = TU.parseProductResponseForScoreTracking(prodResponse, score);
  //         // ave record to database and move to next record.
  //         if (newScore !== null) {
  //           await DB.creditScoreTrackings.update(newScore);
  //         }
  //         counter++;
  //       }
  //       return rec;
  //     }),
  //   );
  //   const results = {
  //     success: true,
  //     error: null,
  //     data: `Transunion credit score updates worker successfully processed ${counter} records`,
  //   };
  //   return JSON.stringify(results);
  // } catch (err) {
  //   const error = errorLogger.createError('credit_score_updates_system', 'unknown_server_error', JSON.stringify(err));
  //   await errorLogger.logger.create(error);
  //   return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  // }
};
