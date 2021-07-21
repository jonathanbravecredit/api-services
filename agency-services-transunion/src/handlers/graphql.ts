import { AppSyncResolverEvent } from 'aws-lambda';
import { response } from 'lib/utils/response';
import * as https from 'https';
import * as fs from 'fs';
import * as queries from 'lib/queries';
import * as secrets from 'lib/utils/secrets';

// request.debug = true; import * as request from 'request';
const transunionSKLoc = process.env.TU_SECRET_LOCATION;
let key: Buffer;
let cert: Buffer;
let cacert: Buffer;
let username = 'CC2BraveCredit';
let accountCode = '123456789';
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

  try {
    const secretJSON = await secrets.getSecretKey(transunionSKLoc);
    const { tuKeyPassphrase, tuPassword } = JSON.parse(secretJSON);
    password = tuPassword;
    passphrase = tuKeyPassphrase;
    user = `${username}:${password}`;
    auth = 'Basic ' + Buffer.from(user).toString('base64');
  } catch (err) {
    return response(500, { error: `Error gathering/reading secrets=${err}` });
  }

  try {
    key = fs.readFileSync('/opt/tubravecredit.key');
    cert = fs.readFileSync('/opt/brave.credit.crt');
    cacert = fs.readFileSync('/opt/Root-CA-Bundle.crt');
  } catch (err) {
    return response(500, { error: `Error gathering/reading cert=${err}` });
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
        results = await queries.Ping(httpsAgent, auth);
        return JSON.stringify({ PingResults: results });
      case 'IndicativeEnrichment':
        results = await queries.IndicativeEnrichment(accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ IndicativeEnrichmentResults: results });
      case 'GetAuthenticationQuestions':
        results = await queries.GetAuthenticationQuestions(accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ GetAuthenticationQuestions: results });
      case 'VerifyAuthenticationQuestions':
        results = await queries.VerifyAuthenticationQuestions(accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ VerifyAuthenticationQuestions: results });
      case 'Enroll':
        results = await queries.Enroll(accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ Enroll: results });
      case 'Fulfill':
        results = await queries.Fulfill(accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ Fulfill: results });
      case 'GetServiceProduct':
        results = await queries.GetServiceProduct(accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ GetServiceProduct: results });
      case 'GetDisputeStatus':
        results = await queries.GetDisputeStatus(accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ GetDisputeStatus: results });
      case 'StartDispute':
        results = await queries.StartDispute(accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ StartDispute: results });
      case 'GetDisputeHistory':
        results = await queries.GetDisputeHistory(accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ GetDisputeHistory: results });
      case 'DisputePreflightCheck':
        results = await queries.DisputePreflightCheck(accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ DisputePreflightCheck: results });
      case 'GetInvestigationResults':
        results = await queries.GetInvestigationResults(accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ GetInvestigationResults: results });
      default:
        return JSON.stringify({ Action: action, Error: 'Action not found' });
    }
  } catch (err) {
    console.log('error ===>', err);
    return response(500, { Action: action, Error: err });
  }
};
