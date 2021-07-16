import axios from 'axios';
import { formatEnroll, createEnroll, parseEnroll } from 'lib/soap/enroll';
import { formatFulfill, createFulfill, parseFulfill } from 'lib/soap/fulfill';
import {
  formatGetAuthenticationQuestions,
  createGetAuthenticationQuestions,
} from 'lib/soap/get-authentication-questions';
import { formatGetDisputeStatus, createGetDisputeStatus } from 'lib/soap/get-dispute-status';
import {
  formatGetServiceProduct,
  createGetServiceProduct,
  parseCreditBureau,
  parseInvestigationResults,
} from 'lib/soap/get-service-product';
import { formatIndicativeEnrichment, createIndicativeEnrichment } from 'lib/soap/indicative-enrichment';
import { createPing } from 'lib/soap/ping';
import {
  formatVerifyAuthenticationQuestions,
  createVerifyAuthenticationQuestions,
} from 'lib/soap/verify-authentication-questions';
import {
  createPackage,
  createRequestOptions,
  postGraphQLRequest,
  processRequest,
  returnNestedObject,
} from 'lib/utils/helpers';

import * as https from 'https';
import * as convert from 'xml-js';
import * as fastXml from 'fast-xml-parser';
import { patchDisputes, updatePreflightStatus } from 'lib/queries/custom-graphql';
import { createStartDispute, formatStartDispute } from 'lib/soap/start-dispute';
import { createGetDisputeHistory, formatGetDisputeHistory } from 'lib/soap/get-dispute-history';
import { formatGetInvestigationResults, createGetInvestigationResults } from 'lib/soap/get-investigation-results';
import { IFulfillResponse } from 'lib/interfaces/fulfill.interface';
import { IEnrollResponse } from 'lib/interfaces/enroll.interface';
import { getAppData } from 'lib/soap/test';
import { IGetAppDataRequest } from 'lib/interfaces/get-app-data.interface';
import { ajv } from 'lib/schema/validation';

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
    return processRequest(options, fastXml.parse, parserOptions);
  } catch (err) {
    return err;
  }
};

/**
 * This initiates the dispute process
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Full message format (fullfillment key required)...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const Test = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
  let variables: IGetAppDataRequest = {
    ...JSON.parse(message),
  }; // can add schema validation here or in the query
  const validate = ajv.getSchema<IGetAppDataRequest>('getAppDataRequest');
  console.log('validation ===> ', validate(variables));
  // if (validate(variables))
  try {
    const resp = await getAppData(variables);
    return resp ? resp.data : undefined;
  } catch (err) {
    return err;
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
  const { msg, xml } = createPackage(
    accountCode,
    username,
    message,
    formatIndicativeEnrichment,
    createIndicativeEnrichment,
  );
  const options = createRequestOptions(agent, auth, xml, 'IndicativeEnrichment');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    return processRequest(options, fastXml.parse, parserOptions);
  } catch (err) {
    return err;
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
  const { msg, xml } = createPackage(
    accountCode,
    username,
    message,
    formatGetAuthenticationQuestions,
    createGetAuthenticationQuestions,
  );
  const options = createRequestOptions(agent, auth, xml, 'GetAuthenticationQuestions');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    return processRequest(options, fastXml.parse, parserOptions);
  } catch (err) {
    return err;
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
  const { msg, xml } = createPackage(
    accountCode,
    username,
    message,
    formatVerifyAuthenticationQuestions,
    createVerifyAuthenticationQuestions,
  );
  const options = createRequestOptions(agent, auth, xml, 'VerifyAuthenticationQuestions');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    return processRequest(options, fastXml.parse, parserOptions);
  } catch (err) {
    return err;
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
): Promise<IEnrollResponse> => {
  const { msg, xml } = createPackage(accountCode, username, message, formatEnroll, createEnroll);
  const options = createRequestOptions(agent, auth, xml, 'Enroll');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    return processRequest(options, parseEnroll, parserOptions);
  } catch (err) {
    return err;
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
): Promise<IFulfillResponse> => {
  const { msg, xml } = createPackage(accountCode, username, message, formatFulfill, createFulfill);
  const options = createRequestOptions(agent, auth, xml, 'Fulfill');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    return processRequest(options, parseFulfill, parserOptions);
  } catch (err) {
    return err;
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
  const { msg, xml } = createPackage(accountCode, username, message, formatGetServiceProduct, createGetServiceProduct);
  const options = createRequestOptions(agent, auth, xml, 'GetServiceProduct');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    return processRequest(options, fastXml.parse, parserOptions);
  } catch (err) {
    return err;
  }
};

/**
 * Confirms eligibility to open a dispute
 *  (Optional) ID can be passsed to check status of open dispute
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
  const { msg, xml } = createPackage(accountCode, username, message, formatGetDisputeStatus, createGetDisputeStatus);
  const options = createRequestOptions(agent, auth, xml, 'GetDisputeStatus');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    return processRequest(options, fastXml.parse, parserOptions);
  } catch (err) {
    return err;
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
export const StartDispute = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
  const { msg, xml } = createPackage(accountCode, username, message, formatStartDispute, createStartDispute);
  const options = createRequestOptions(agent, auth, xml, 'StartDispute');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    return processRequest(options, fastXml.parse, parserOptions);
  } catch (err) {
    return err;
  }
};

/**
 * Return the dispute history
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Full message format (fullfillment key required)...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const GetDisputeHistory = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
  const { msg, xml } = createPackage(accountCode, username, message, formatGetDisputeHistory, createGetDisputeHistory);
  const options = createRequestOptions(agent, auth, xml, 'GetDisputeHistory');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    return processRequest(options, fastXml.parse, parserOptions);
  } catch (err) {
    return err;
  }
};

/**
 * This initiates the dispute process
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Full message format (fullfillment key required)...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const GetInvestigationResults = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
  const { msg, xml } = createPackage(
    accountCode,
    username,
    message,
    formatGetInvestigationResults,
    createGetInvestigationResults,
  );
  const options = createRequestOptions(agent, auth, xml, 'GetInvestigationResults');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    return processRequest(options, parseCreditBureau, parserOptions);
    // results = parseInvestigationResults(results, xmlOptions); // may need to add this additionallayer of parsing
  } catch (err) {
    return err;
  }
};

/*======================*/
/* !!!! NEEDs WORK !!!! */
/* attempting to bundle */
/* it all together      */
/*======================*/
/**
 * This performs the preflight check and returns the dispute status eligibility
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Full message format (fullfillment key required)...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const DisputePreflightCheck = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
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
    throw new Error(`Error in initiating Preflight status; Error:${err}`);
  }

  try {
    disputeStatus = await GetDisputeStatus(accountCode, username, message, agent, auth);
    disputeStatus = returnNestedObject(JSON.parse(disputeStatus), 'ResponseType');
    console.log('dispute status', disputeStatus);
  } catch (err) {
    console.log('preflight check disputeStatus error ====> ', err);
    throw new Error(`Error in GetDisputeStatus; Error:${err}`);
  }

  const eligibility = disputeStatus.toLowerCase() === 'success' ? 'success' : 'ineligible';
  variables = {
    id: message,
    msg: JSON.stringify({
      disputePreflightStatus: 'success',
      disputeEligibility: eligibility,
    }),
  };
  try {
    const resp2 = await postGraphQLRequest(patchDisputes, variables);
    console.log('response 2', resp2);
  } catch (err) {
    throw new Error(`Error in ending Preflight status; Error:${err}`);
  }

  return 'Success';
};

/**
 * This initiates the dispute process
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Full message format (fullfillment key required)...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const DisputeInitiation = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<string> => {
  try {
    return await StartDispute(accountCode, username, message, agent, auth);
  } catch (err) {
    return JSON.stringify(err);
  }
};
