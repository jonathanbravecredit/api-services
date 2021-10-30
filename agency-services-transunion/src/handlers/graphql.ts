import 'reflect-metadata';
import { AppSyncResolverEvent } from 'aws-lambda';
import * as https from 'https';
import * as fs from 'fs';
import * as queries from 'lib/proxy';
import * as secrets from 'lib/utils/secrets/secrets';
import * as tokens from 'lib/utils/tokens/tokens';
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

  let tokenUser;
  try {
    const token = event['token'];
    const { sub } = await tokens.validateToken(token);
    if (sub === undefined) throw token;
    tokenUser = sub;
  } catch (err) {
    const error = errorLogger.createError('invalid_token_user', 'ValidateToken', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: `Invalid token parsed to user, token:=${err}` };
  }

  const l1 = transactionLogger.createTransaction(tokenUser, `${action}:action`, JSON.stringify(action));
  const l2 = transactionLogger.createTransaction(tokenUser, `${action}:message`, JSON.stringify(message));
  await transactionLogger.logger.create(l1);
  await transactionLogger.logger.create(l2);

  try {
    const secretJSON = await secrets.getSecretKey(transunionSKLoc);
    const { tuKeyPassphrase, tuPassword } = JSON.parse(secretJSON);
    password = tuPassword;
    passphrase = tuKeyPassphrase;
    user = `${username}:${password}`;
    auth = 'Basic ' + Buffer.from(user).toString('base64');
  } catch (err) {
    const error = errorLogger.createError(tokenUser, 'get_secrets_failure', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: { error: `Error gathering/reading secrets=${err}` } };
  }

  try {
    const prefix = tuEnv === 'dev' ? 'dev' : 'prod';
    key = fs.readFileSync(`/opt/${prefix}-tubravecredit.key`);
    cert = fs.readFileSync(`/opt/${prefix}-brave.credit.crt`);
    cacert = fs.readFileSync(`/opt/${prefix}-Root-CA-Bundle.crt`);
  } catch (err) {
    const error = errorLogger.createError(tokenUser, 'get_certificates_failure', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: { error: `Error gathering/reading cert=${err}` } };
  }

  try {
    const httpsAgent = new https.Agent({
      key,
      cert,
      passphrase,
    });

    let results: any;
    const payload = {
      accountCode,
      username,
      message,
      agent: httpsAgent,
      auth,
      identityId: tokenUser,
    };
    // do something
    switch (action) {
      case 'Ping':
        results = await queries.Ping(payload);
        return JSON.stringify(results);
      case 'IndicativeEnrichment':
        results = await queries.IndicativeEnrichment(payload);
        return JSON.stringify(results);
      case 'GetAuthenticationQuestions':
        results = await queries.GetAuthenticationQuestions(payload);
        return JSON.stringify(results);
      case 'VerifyAuthenticationQuestions':
        results = await queries.VerifyAuthenticationQuestions(payload);
        return JSON.stringify(results);
      case 'Enroll':
        results = await queries.Enroll(payload);
        return JSON.stringify(results);
      case 'EnrollDisputes':
        results = await queries.EnrollDisputes(payload);
        return JSON.stringify(results);
      case 'Fulfill':
        results = await queries.Fulfill(payload);
        return JSON.stringify(results);
      case 'FulfillDisputes':
        results = await queries.FulfillDisputes(payload);
        return JSON.stringify(results);
      case 'GetServiceProduct':
        results = await queries.GetServiceProduct(payload);
        return JSON.stringify(results);
      case 'GetDisputeStatus':
        results = await queries.GetDisputeStatus(payload);
        return JSON.stringify(results);
      case 'StartDispute':
        results = await queries.StartDispute(payload);
        return JSON.stringify(results);
      case 'GetAllDisputesByUser':
        results = await queries.GetAllDisputesByUser(payload);
        return JSON.stringify(results);
      case 'GetCurrentDisputeByUser':
        results = await queries.GetCurrentDisputeByUser(payload);
        return JSON.stringify(results);
      case 'GetDisputeHistory':
        results = await queries.GetDisputeHistory(payload);
        return JSON.stringify(results);
      case 'CompleteOnboardingEnrollments':
        results = await queries.CompleteOnboardingEnrollments(payload);
        return JSON.stringify(results);
      case 'DisputePreflightCheck':
        results = await queries.DisputePreflightCheck(payload);
        return JSON.stringify(results);
      case 'GetInvestigationResults':
        results = await queries.GetInvestigationResults(payload);
        return JSON.stringify(results);
      case 'GetTrendingData':
        results = await queries.GetTrendingData(payload);
        return JSON.stringify(results);
      case 'GetInvestigationResultsByID':
        results = await queries.GetInvestigationResultsByID(payload);
        return JSON.stringify(results);
      case 'GetCreditBureauResultsByID':
        results = await queries.GetCreditBureauResultsByID(payload);
        return JSON.stringify(results);
      default:
        const error = errorLogger.createError(tokenUser, 'action_not_found', JSON.stringify(action));
        await errorLogger.logger.create(error);
        return JSON.stringify({ success: false, error: 'Action not found', data: action });
    }
  } catch (err) {
    const error = errorLogger.createError(tokenUser, 'unknown_server_error', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: { error: `Unknown server error=${err}` } };
  }
};
