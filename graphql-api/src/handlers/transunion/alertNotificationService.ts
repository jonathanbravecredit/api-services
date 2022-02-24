import 'reflect-metadata';
import { AppSyncResolverEvent } from 'aws-lambda';
import * as https from 'https';
import * as fs from 'fs';
import * as queries from 'lib/proxy';
import * as secrets from 'lib/utils/secrets/secrets';
import ErrorLogger from 'lib/utils/db/logger/logger-errors';
import TransactionLogger from 'lib/utils/db/logger/logger-transactions';

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
export const main: any = async (event: AppSyncResolverEvent<any>): Promise<any> => {
  const action: string = event?.arguments?.action;
  const message: string = event?.arguments?.message;

  try {
    const secretJSON = await secrets.getSecretKey(transunionSKLoc);
    const { tuKeyPassphrase, tuPassword } = JSON.parse(secretJSON);
    password = tuPassword;
    passphrase = tuKeyPassphrase;
    user = `${username}:${password}`;
    auth = 'Basic ' + Buffer.from(user).toString('base64');
  } catch (err) {
    const error = errorLogger.createError('alert_notification_operation', 'get_secrets_failure', JSON.stringify(err));
    errorLogger.logger.create(error);
    return { success: false, error: { error: `Error gathering/reading secrets=${err}` } };
  }

  try {
    const prefix = tuEnv === 'dev' ? 'dev' : 'prod';
    key = fs.readFileSync(`/opt/${prefix}-tubravecredit.key`);
    cert = fs.readFileSync(`/opt/${prefix}-brave.credit.crt`);
    cacert = fs.readFileSync(`/opt/${prefix}-Root-CA-Bundle.crt`);
  } catch (err) {
    const error = errorLogger.createError(
      'alert_notification_operation',
      'get_certificates_failure',
      JSON.stringify(err),
    );
    errorLogger.logger.create(error);
    return { success: false, error: { error: `Error gathering/reading cert=${err}` } };
  }

  try {
    const httpsAgent = new https.Agent({
      key,
      cert,
      passphrase,
    });
    const payload = {
      accountCode,
      username,
      message,
      agent: httpsAgent,
      auth,
      identityId: '',
    };
    const results: any = await queries.DisputeInflightCheck(payload);

    return JSON.stringify(results);
  } catch (err) {
    const error = errorLogger.createError('alert_notification_operation', 'unknown_server_error', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  }
};
