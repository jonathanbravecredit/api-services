import { AppSyncResolverEvent } from 'aws-lambda';
import * as https from 'https';
import * as fs from 'fs';
import * as queries from 'lib/proxy';
import * as secrets from 'lib/utils/secrets/secrets';
import * as tokens from 'lib/utils/tokens/tokens';

// request.debug = true; import * as request from 'request';
const transunionSKLoc = process.env.TU_SECRET_LOCATION;
let key: Buffer;
let cert: Buffer;
let cacert: Buffer;
let username = 'CC2BraveCredit';
let accountCode = 'M2RVc0ZZM0Rwd2FmZA';
let url = 'https://cc2ws-live.sd.demo.truelink.com/wcf/CC2.svc?singleWsdl';
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
  console.log('event ====> ', event);
  const action: string = event?.arguments?.action;
  const message: string = event?.arguments?.message;

  console.log('action', action);
  console.log('message', message);

  let tokenUser;
  try {
    const token = event['token'];
    const { sub } = await tokens.validateToken(token);
    console.log('decoded user ===> ', sub);
    if (sub === undefined) throw user;
    tokenUser = sub;
  } catch (err) {
    return { success: false, error: `Invalid token parsed to user` };
  }

  try {
    const secretJSON = await secrets.getSecretKey(transunionSKLoc);
    const { tuKeyPassphrase, tuPassword } = JSON.parse(secretJSON);
    password = tuPassword;
    passphrase = tuKeyPassphrase;
    user = `${username}:${password}`;
    auth = 'Basic ' + Buffer.from(user).toString('base64');
  } catch (err) {
    return { success: false, error: { error: `Error gathering/reading secrets=${err}` } };
  }

  try {
    const subfolder = process.env.NODE_ENV === 'dev' ? 'dev' : 'prod';
    key = fs.readFileSync(`/opt/${subfolder}/tubravecredit.key`);
    cert = fs.readFileSync(`/opt/${subfolder}/brave.credit.crt`);
    cacert = fs.readFileSync(`/opt/${subfolder}/Root-CA-Bundle.crt`);
  } catch (err) {
    return { success: false, error: { error: `Error gathering/reading cert=${err}` } };
  }

  try {
    const httpsAgent = new https.Agent({
      key,
      cert,
      passphrase,
    });

    let results: any;
    // do something
    switch (action) {
      case 'Ping':
        results = await queries.Ping(httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      case 'IndicativeEnrichment':
        results = await queries.IndicativeEnrichment(accountCode, username, message, httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      case 'GetAuthenticationQuestions':
        results = await queries.GetAuthenticationQuestions(accountCode, username, message, httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      case 'VerifyAuthenticationQuestions':
        results = await queries.VerifyAuthenticationQuestions(
          accountCode,
          username,
          message,
          httpsAgent,
          auth,
          tokenUser,
        );
        return JSON.stringify(results);
      case 'Enroll':
        results = await queries.Enroll(accountCode, username, message, httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      case 'EnrollDisputes':
        results = await queries.EnrollDisputes(accountCode, username, message, httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      case 'Fulfill':
        results = await queries.Fulfill(accountCode, username, message, httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      case 'FulfillDisputes':
        results = await queries.FulfillDisputes(accountCode, username, message, httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      case 'GetServiceProduct':
        results = await queries.GetServiceProduct(accountCode, username, message, httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      case 'GetDisputeStatus':
        results = await queries.GetDisputeStatus(accountCode, username, message, httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      case 'StartDispute':
        results = await queries.StartDispute(accountCode, username, message, httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      case 'GetDisputeHistory':
        results = await queries.GetDisputeHistory(accountCode, username, message, httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      case 'CompleteOnboardingEnrollments':
        results = await queries.CompleteOnboardingEnrollments(
          accountCode,
          username,
          message,
          httpsAgent,
          auth,
          tokenUser,
        );
        return JSON.stringify(results);
      case 'DisputePreflightCheck':
        results = await queries.DisputePreflightCheck(accountCode, username, message, httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      case 'GetInvestigationResults':
        results = await queries.GetInvestigationResults(accountCode, username, message, httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      case 'GetTrendingData':
        results = await queries.GetTrendingData(accountCode, username, message, httpsAgent, auth, tokenUser);
        return JSON.stringify(results);
      default:
        return JSON.stringify({ success: false, error: 'Action not found', data: action });
    }
  } catch (err) {
    console.log('error ===>', err);
    return { success: false, error: { error: `Unknown server error=${err}` } };
  }
};
