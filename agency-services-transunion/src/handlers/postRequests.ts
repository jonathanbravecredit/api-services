import { SNSEvent, SNSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import axios from 'axios';
import * as https from 'https';
import * as fs from 'fs';
import * as convert from 'xml-js';
import { getSecretKey } from 'lib/utils/secrets';
import { createRequestOptions } from 'lib/utils/helpers';
import { createIndicativeEnrichment, formatIndicativeEnrichment } from 'lib/queries/indicative-enrichment';
import { createPing } from 'lib/queries/ping';
import { IIndicativeEnrichmentResponse } from 'lib/interfaces/indicative-enrichment.interface';
import { IAuthenticationResponse } from 'lib/interfaces/authentication.interface';
import { createAuthentication, formatAuthentication } from 'lib/queries/authentication';

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
// let client: soap.Client;

/**
 * Handler that processes single requests for Transunion services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @returns Lambda proxy response
 */
export const main: SNSHandler = async (event: SNSEvent): Promise<any> => {
  try {
    const secretJSON = await getSecretKey(transunionSKLoc);
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

    for (const record of event.Records) {
      let results;
      // do something
      switch (JSON.parse(record.Sns.Message)?.action) {
        case 'IndicativeEnrichment':
          results = await proxyHandler['IndicativeEnrichment'](
            accountCode,
            username,
            record.Sns.Message,
            httpsAgent,
            auth,
          );
          console.log('axios resA', results); // what do I do with this...write to db
          // is SSN full added...if so send success message back to db.
          // if not then send error message back to db and then request full SSN
          break;
        case 'Ping':
          results = await proxyHandler['Ping'](httpsAgent, auth);
          console.log('axios resB', results);
          break;
        default:
          break;
      }
    }
    // return response(200, { response: 'sucessfully processed all messages' });
  } catch (err) {
    console.log('error ===>', err);
    // console.log('last request ===>', client.lastRequest);
    return;
  }
};

const proxyHandler = {
  Ping: async (agent: https.Agent, auth: string): Promise<string> => {
    const xml = createPing();
    const options = createRequestOptions(agent, auth, xml, 'Ping');
    const res = await axios({ ...options });
    const results = convert.xml2json(res.data, { compact: true });
    return results;
  },
  IndicativeEnrichment: async (
    accountCode: string,
    username: string,
    message: string,
    agent: https.Agent,
    auth: string,
  ): Promise<string> => {
    const msg = formatIndicativeEnrichment(accountCode, username, JSON.parse(message));
    const xml = createIndicativeEnrichment(msg);
    const options = createRequestOptions(agent, auth, xml, 'IndicativeEnrichment');
    const res = await axios({ ...options });
    const results = convert.xml2json(res.data, { compact: true });
    return results;
  },
  Authentication: async (
    accountCode: string,
    username: string,
    message: string,
    agent: https.Agent,
    auth: string,
  ): Promise<string> => {
    const msg = formatAuthentication(accountCode, username, JSON.parse(message));
    const xml = createAuthentication(msg);
    const options = createRequestOptions(agent, auth, xml, 'Authentication');
    const res = await axios({ ...options });
    const results = convert.xml2json(res.data, { compact: true });
    return results;
  },
};
