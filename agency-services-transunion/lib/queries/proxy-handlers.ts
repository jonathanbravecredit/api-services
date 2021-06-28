import axios from 'axios';
import { formatEnroll, createEnroll, parseEnroll } from 'lib/soap/enroll';
import { formatFulfill, createFulfill, parseFulfill } from 'lib/soap/fulfill';
import {
  formatGetAuthenticationQuestions,
  createGetAuthenticationQuestions,
} from 'lib/soap/get-authentication-questions';
import { formatGetDisputeStatus, createGetDisputeStatus } from 'lib/soap/get-dispute-status';
import { formatGetServiceProduct, createGetServiceProduct } from 'lib/soap/get-service-product';
import { formatIndicativeEnrichment, createIndicativeEnrichment } from 'lib/soap/indicative-enrichment';
import { createPing } from 'lib/soap/ping';
import {
  formatVerifyAuthenticationQuestions,
  createVerifyAuthenticationQuestions,
} from 'lib/soap/verify-authentication-questions';
import { createRequestOptions, postGraphQLRequest, returnNestedObject } from 'lib/utils/helpers';

import * as https from 'https';
import * as convert from 'xml-js';
import * as fastXml from 'fast-xml-parser';
import { patchDisputes, updatePreflightStatus } from 'lib/queries/custom-graphql';

const parserOptions = {
  attributeNamePrefix: '',
  ignoreAttributes: false,
  ignoreNameSpace: true,
  parseAttributeValue: true,
};

/**
 * Simple method to ping TU services and ensure a successful response
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const Ping = async (agent: https.Agent, auth: string): Promise<string> => {
  const xml = createPing();
  const options = createRequestOptions(agent, auth, xml, 'Ping');
  if (!xml || !options) throw new Error(`Missing xml:${xml}, or options:${options}`);
  try {
    const res = await axios({ ...options });
    const results = convert.xml2json(res.data, { compact: true }); // TODO switch over to fast-xml-parser...handles data much better
    return results;
  } catch (err) {
    return JSON.stringify(err);
  }
};

/**
 * This enriches the users profile with attributes like name, address, dob
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in IE message format...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns full ssn for verification
 */
export const IndicativeEnrichment = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
  const msg = formatIndicativeEnrichment(accountCode, username, message);
  const xml = createIndicativeEnrichment(msg);
  const options = createRequestOptions(agent, auth, xml, 'IndicativeEnrichment');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    const res = await axios({ ...options });
    const results = convert.xml2json(res.data, { compact: true }); // TODO need to switch over to new parser
    return results;
  } catch (err) {
    return JSON.stringify(err);
  }
};

/**
 * This returns either a passcode or KBA questions which are needed to present to user
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Authentication message format...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const GetAuthenticationQuestions = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
  const msg = formatGetAuthenticationQuestions(accountCode, username, message);
  const xml = createGetAuthenticationQuestions(msg);
  const options = createRequestOptions(agent, auth, xml, 'GetAuthenticationQuestions');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    const res = await axios({ ...options });
    const results = convert.xml2json(res.data, { compact: true }); // TODO need to switch over to new parser
    return results;
  } catch (err) {
    return JSON.stringify(err);
  }
};

/**
 * Sends the OTP or KBA answers to TU to verify
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Verify message format...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const VerifyAuthenticationQuestions = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
  const msg = formatVerifyAuthenticationQuestions(accountCode, username, message);
  const xml = createVerifyAuthenticationQuestions(msg);
  const options = createRequestOptions(agent, auth, xml, 'VerifyAuthenticationQuestions');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    const res = await axios({ ...options });
    const results = fastXml.parse(res.data); // TODO need to update with options
    return results;
  } catch (err) {
    return JSON.stringify(err);
  }
};

/**
 * After verification the user is eligible to enroll.
 * Enrolls user and returns merge report and vantage score
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Enrollment message format...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const Enroll = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
  const msg = formatEnroll(accountCode, username, message);
  const xml = createEnroll(msg);
  const options = createRequestOptions(agent, auth, xml, 'Enroll');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    const res = await axios({ ...options });
    const results = parseEnroll(res.data, parserOptions); // a more robust parser to parse nested objects
    return JSON.stringify(results);
  } catch (err) {
    return JSON.stringify(err);
  }
};

/**
 * A returning user can refresh their report by calling fulfill
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Full message format (fullfillment key required)...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const Fulfill = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
  const msg = formatFulfill(accountCode, username, message);
  const xml = createFulfill(msg);
  const options = createRequestOptions(agent, auth, xml, 'Fulfill');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    const res = await axios({ ...options });
    const results = parseFulfill(res.data, parserOptions); // a more robust parser to parse nested objects
    // write to the database.
    // get the current
    return JSON.stringify(results);
  } catch (err) {
    return JSON.stringify(err);
  }
};

/**
 * A returning user can return the already pulled report
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Full message format (fullfillment key required)...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const GetServiceProduct = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
  const msg = formatGetServiceProduct(accountCode, username, message);
  const xml = createGetServiceProduct(msg);
  const options = createRequestOptions(agent, auth, xml, 'GetServiceProduct');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    const res = await axios({ ...options });
    const results = fastXml.parse(res.data, parserOptions); // basic parse for now
    return JSON.stringify(results);
  } catch (err) {
    return JSON.stringify(err);
  }
};

/**
 * Confirms eligibility to open a dispute
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Full message format (fullfillment key required)...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const GetDisputeStatus = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
  const msg = formatGetDisputeStatus(accountCode, username, message);
  const xml = createGetDisputeStatus(msg);
  const options = createRequestOptions(agent, auth, xml, 'GetDisputeStatus');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    const res = await axios({ ...options });
    const results = fastXml.parse(res.data, parserOptions); // basic parse for now
    return JSON.stringify(results);
  } catch (err) {
    return JSON.stringify(err);
  }
};

export const DisputePreflightCheck = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
  // //call fulfill
  let report: string;
  let disputeStatus: string;
  let variables = {
    id: message,
    msg: JSON.stringify({
      disputePreflightStatus: 'inprogress',
    }),
  };

  try {
    const resp1 = await postGraphQLRequest(patchDisputes, variables);
    console.log('response 1', resp1);
  } catch (err) {
    console.log('error: ===>', err);
  }
  // start simple...assume you call the step...it starts and then finishes
  // try {
  //   report = await Fulfill(accountCode, username, message, agent, auth);
  //   // assume we refresh the data in the database for now
  // } catch (err) {
  //   console.log('preflight check fulfill error ====> ', err);
  //   throw new Error(err);
  //   // updated the preflight check with 'failed'
  // }

  // try {
  //   disputeStatus = await GetDisputeStatus(accountCode, username, message, agent, auth);
  //   disputeStatus = returnNestedObject(JSON.parse(disputeStatus), 'ResponseType');
  // } catch (err) {
  //   console.log('preflight check disputeStatus error ====> ', err);
  //   throw new Error(err);
  // }

  variables = {
    id: message,
    msg: JSON.stringify({
      disputePreflightStatus: 'success',
    }),
  };
  try {
    const resp2 = await postGraphQLRequest(patchDisputes, variables);
    console.log('response 2', resp2);
  } catch (err) {
    console.log('error: ===>', err);
  }

  // if (disputeStatus.toLowerCase() === 'success') {
  //   // update preflight check to success
  //   // call start dispute
  //   variables = {
  //     id: message,
  //     disputes: {
  //       disputePreflightStatus: 'success',
  //     }
  //   };
  // }

  return 'Success';
};
