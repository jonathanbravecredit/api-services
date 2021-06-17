import { AppSyncResolverEvent, AppSyncResolverHandler, SNSEvent, SNSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import axios from 'axios';
import * as https from 'https';
import * as fs from 'fs';
import * as convert from 'xml-js';
import * as fastXml from 'fast-xml-parser';
import { getSecretKey } from 'lib/utils/secrets';
import { createRequestOptions, returnNestedObject } from 'lib/utils/helpers';
import { createIndicativeEnrichment, formatIndicativeEnrichment } from 'lib/queries/indicative-enrichment';
import { createPing } from 'lib/queries/ping';
import {
  createGetAuthenticationQuestions,
  formatGetAuthenticationQuestions,
} from 'lib/queries/get-authentication-questions';
import {
  createVerifyAuthenticationQuestions,
  formatVerifyAuthenticationQuestions,
} from 'lib/queries/verify-authentication-questions';
import { createEnroll, formatEnroll, parseEnroll } from 'lib/queries/enroll';
import { IEnrollResponse } from 'lib/interfaces/enroll.interface';
import { createFulfill, formatFulfill, parseFulfill } from 'lib/queries/fulfill';
import { createGetServiceProduct, formatGetServiceProduct } from 'lib/queries/get-service-product';

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

// Trying new parser
const Parser = fastXml.j2xParser;
const parser = new Parser({});

const parserOptions = {
  attributeNamePrefix: '',
  ignoreAttributes: false,
  ignoreNameSpace: true,
  parseAttributeValue: true,
};

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

    let results;
    // do something
    switch (action) {
      case 'Ping':
        results = await proxyHandler['Ping'](httpsAgent, auth);
        return JSON.stringify({ PingResults: results });
      case 'IndicativeEnrichment':
        results = await proxyHandler['IndicativeEnrichment'](accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ IndicativeEnrichmentResults: results });
      case 'GetAuthenticationQuestions':
        results = await proxyHandler['GetAuthenticationQuestions'](accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ GetAuthenticationQuestions: results });
      case 'VerifyAuthenticationQuestions':
        results = await proxyHandler['VerifyAuthenticationQuestions'](accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ VerifyAuthenticationQuestions: results });
      case 'Enroll':
        results = await proxyHandler['Enroll'](accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ Enroll: results });
      case 'Fulfill':
        results = await proxyHandler['Fulfill'](accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ Fulfill: results });
      case 'GetServiceProduct':
        results = await proxyHandler['GetServiceProduct'](accountCode, username, message, httpsAgent, auth);
        return JSON.stringify({ GetServiceProduct: results });
      default:
        return JSON.stringify({ Action: action, Error: 'Action not found' });
    }
  } catch (err) {
    console.log('error ===>', err);
    return response(500, { Action: action, Error: err });
  }
};

const proxyHandler = {
  Ping: async (agent: https.Agent, auth: string): Promise<string> => {
    const xml = createPing();
    const options = createRequestOptions(agent, auth, xml, 'Ping');
    const res = await axios({ ...options });
    const results = convert.xml2json(res.data, { compact: true }); // TODO switch over to fast-xml-parser...handles data much better
    return results;
  },
  IndicativeEnrichment: async (
    accountCode: string,
    username: string,
    message: string,
    agent: https.Agent,
    auth: string,
  ): Promise<string> => {
    const msg = formatIndicativeEnrichment(accountCode, username, message);
    const xml = createIndicativeEnrichment(msg);
    console.log('IE xml====>', xml);
    const options = createRequestOptions(agent, auth, xml, 'IndicativeEnrichment');
    const res = await axios({ ...options });
    const results = convert.xml2json(res.data, { compact: true }); // TODO need to switch over to new parser
    return results;
  },
  GetAuthenticationQuestions: async (
    accountCode: string,
    username: string,
    message: string,
    agent: https.Agent,
    auth: string,
  ): Promise<string> => {
    const msg = formatGetAuthenticationQuestions(accountCode, username, message);
    const xml = createGetAuthenticationQuestions(msg);
    console.log('Auth xml====>', xml);
    const options = createRequestOptions(agent, auth, xml, 'GetAuthenticationQuestions');
    const res = await axios({ ...options });
    console.log('data', res.data);
    const results = convert.xml2json(res.data, { compact: true }); // TODO need to switch over to new parser
    console.log('resulrs', results);
    return results;
  },
  VerifyAuthenticationQuestions: async (
    accountCode: string,
    username: string,
    message: string,
    agent: https.Agent,
    auth: string,
  ): Promise<string> => {
    const msg = formatVerifyAuthenticationQuestions(accountCode, username, message);
    const xml = createVerifyAuthenticationQuestions(msg);
    console.log('Verify xml====>', xml);
    const options = createRequestOptions(agent, auth, xml, 'VerifyAuthenticationQuestions');
    const res = await axios({ ...options });
    const results = fastXml.parse(res.data); // TODO need to update with options
    console.log('results', results);
    return results;
  },
  Enroll: async (
    accountCode: string,
    username: string,
    message: string,
    agent: https.Agent,
    auth: string,
  ): Promise<string> => {
    const msg = formatEnroll(accountCode, username, message);
    const xml = createEnroll(msg);
    console.log('Verify xml====>', xml);
    const options = createRequestOptions(agent, auth, xml, 'Enroll');
    const res = await axios({ ...options });
    console.log('Response xml ====> ', JSON.stringify(res.data));
    const results = parseEnroll(res.data, parserOptions); // a more robust parser to parse nested objects
    console.log('results', results);
    return JSON.stringify(results);
  },
  Fulfill: async (
    accountCode: string,
    username: string,
    message: string,
    agent: https.Agent,
    auth: string,
  ): Promise<string> => {
    const msg = formatFulfill(accountCode, username, message);
    const xml = createFulfill(msg);
    console.log('Verify xml====>', xml);
    const options = createRequestOptions(agent, auth, xml, 'Fulfill');
    const res = await axios({ ...options });
    console.log('Response xml ====> ', JSON.stringify(res.data));
    const results = parseFulfill(res.data, parserOptions); // a more robust parser to parse nested objects
    console.log('results', results);
    return JSON.stringify(results);
  },
  GetServiceProduct: async (
    accountCode: string,
    username: string,
    message: string,
    agent: https.Agent,
    auth: string,
  ): Promise<string> => {
    const msg = formatGetServiceProduct(accountCode, username, message);
    const xml = createGetServiceProduct(msg);
    console.log('Verify xml====>', xml);
    const options = createRequestOptions(agent, auth, xml, 'GetServiceProduct');
    const res = await axios({ ...options });
    console.log('Response xml ====> ', JSON.stringify(res.data));
    const results = fastXml.parse(res.data, parserOptions); // basic parse for now
    // const results = parseEnroll(res.data); // a more robust parser to parse nested objects
    console.log('results', results);
    return JSON.stringify(results);
  },
};
