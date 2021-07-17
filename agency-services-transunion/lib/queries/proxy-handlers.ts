import { formatEnroll, createEnroll, parseEnroll, createEnrollPayload, enrichEnrollmentData } from 'lib/soap/enroll';
import { formatFulfill, createFulfill, parseFulfill, createFulfillPayload, enrichFulfillData } from 'lib/soap/fulfill';
import {
  formatGetAuthenticationQuestions,
  createGetAuthenticationQuestions,
} from 'lib/soap/get-authentication-questions';
import { formatGetDisputeStatus, createGetDisputeStatus, parseGetDisputeStatus } from 'lib/soap/get-dispute-status';
import { formatGetServiceProduct, createGetServiceProduct, parseCreditBureau } from 'lib/soap/get-service-product';
import { formatIndicativeEnrichment, createIndicativeEnrichment } from 'lib/soap/indicative-enrichment';
import { createPing } from 'lib/soap/ping';
import {
  formatVerifyAuthenticationQuestions,
  createVerifyAuthenticationQuestions,
} from 'lib/soap/verify-authentication-questions';
import { createPackage, createRequestOptions, processRequest, returnNestedObject, syncData } from 'lib/utils/helpers';

import * as https from 'https';
import * as fastXml from 'fast-xml-parser';
import { createStartDispute, formatStartDispute } from 'lib/soap/start-dispute';
import { createGetDisputeHistory, formatGetDisputeHistory } from 'lib/soap/get-dispute-history';
import { formatGetInvestigationResults, createGetInvestigationResults } from 'lib/soap/get-investigation-results';
import { IFulfillGraphQLResponse, IFulfillResponse, IFulfillResult } from 'lib/interfaces/fulfill.interface';
import { IEnrollGraphQLResponse, IEnrollResponse, IEnrollResult } from 'lib/interfaces/enroll.interface';
import { IGetAppDataRequest } from 'lib/interfaces/get-app-data.interface';
import { ajv } from 'lib/schema/validation';
import {
  getEnrollment,
  getDataForEnrollment,
  getDataForFulfill,
  getFulfilledOn,
  getDisputeEnrollment,
} from 'lib/queries/proxy-queries';
import { dateDiffInDays } from 'lib/utils/dates';
import { IGetDisputeStatusResponse } from 'lib/interfaces/get-dispute-status.interface';

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
    return await processRequest(options, fastXml.parse, parserOptions);
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
    return await processRequest(options, fastXml.parse, parserOptions);
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
    return await processRequest(options, fastXml.parse, parserOptions);
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
    return await processRequest(options, fastXml.parse, parserOptions);
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
  dispute: boolean = false,
): Promise<IEnrollResponse> => {
  let variables: IGetAppDataRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<IGetAppDataRequest>('getAppDataRequest');
  if (!validate(variables)) {
    let id = returnNestedObject(JSON.parse(message), 'ClientKey'); // try to remedy
    variables = {
      id: `us-east-2:${id}`,
    };
    if (!validate(variables)) throw `Malformed message=${message}`;
  }

  try {
    const resp = await getDataForEnrollment(variables);
    const gql: IEnrollGraphQLResponse = resp.data; // add validation here
    const payload = createEnrollPayload(gql, dispute);
    const { msg, xml } = createPackage(accountCode, username, JSON.stringify(payload), formatEnroll, createEnroll);
    const options = createRequestOptions(agent, auth, xml, 'Enroll');
    if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
    const enroll = await processRequest(options, parseEnroll, parserOptions);
    const enrollResults: IEnrollResult = returnNestedObject(enroll, 'EnrollResult');
    if (enrollResults?.ResponseType.toLowerCase() === 'success') {
      await syncData(variables, enrollResults, enrichEnrollmentData, dispute);
    } else {
      if (enrollResults?.ErrorResponse['Code'] === '103045') {
        // already enrolled...bypass
        return;
      } else {
        throw `Enroll failure=${enrollResults}`;
      }
    }
    return enroll;
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
  dispute: boolean = false,
): Promise<IFulfillResponse> => {
  let variables: IGetAppDataRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<IGetAppDataRequest>('getAppDataRequest');
  if (!validate(variables)) {
    let id = returnNestedObject(JSON.parse(message), 'ClientKey'); // try to remedy
    variables = {
      id: `us-east-2:${id}`,
    };
    if (!validate(variables)) throw `Malformed message=${message}`;
  }

  try {
    console.log('*** IN FULFILL ***');
    const resp = await getDataForFulfill(variables);
    const gql: IFulfillGraphQLResponse = resp.data; // add validation here
    const payload = createFulfillPayload(gql, dispute);
    const { msg, xml } = createPackage(accountCode, username, JSON.stringify(payload), formatFulfill, createFulfill);
    const options = createRequestOptions(agent, auth, xml, 'Fulfill');
    if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
    const fulfill = await processRequest(options, parseFulfill, parserOptions);
    const fulfillResults: IFulfillResult = returnNestedObject(fulfill, 'FulfillResult');
    await syncData(variables, fulfillResults, enrichFulfillData, dispute);
    return fulfill; // for stand alone calls if needed
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
    return await processRequest(options, fastXml.parse, parserOptions);
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
): Promise<IGetDisputeStatusResponse> => {
  const { msg, xml } = createPackage(accountCode, username, message, formatGetDisputeStatus, createGetDisputeStatus);
  const options = createRequestOptions(agent, auth, xml, 'GetDisputeStatus');
  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    return await processRequest(options, parseGetDisputeStatus, parserOptions);
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
    return await processRequest(options, fastXml.parse, parserOptions);
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
    return await processRequest(options, fastXml.parse, parserOptions);
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
    return await processRequest(options, parseCreditBureau, parserOptions);
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
): Promise<{ eligible: boolean }> => {
  let variables: IGetAppDataRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<IGetAppDataRequest>('getAppDataRequest');
  if (!validate(variables)) throw `Malformed message=${message}`;

  let enrolled: boolean;
  try {
    console.log('*** IN GET ENROLL STATSU ***');
    const { data } = await getDisputeEnrollment(variables);
    console.log('DisputePreflightCheck:getEnrollment 1 ===> ', JSON.stringify(data));
    enrolled = !data ? false : returnNestedObject(data, 'disputeEnrolled');
    console.log('DisputePreflightCheck:enrolled ===> ', enrolled);
  } catch (err) {
    console.log('DisputePreflightCheck:error: ===>', err);
    throw new Error(`DisputePreflightCheck:getEnrollment=${err}`);
  }

  if (!enrolled) {
    console.log('*** IN ENROLL ***');
    try {
      await Enroll(accountCode, username, message, agent, auth, true);
    } catch (err) {
      throw new Error(`DisputePreflightCheck:Enroll=${err}`);
    }
  }

  let refresh: boolean;
  try {
    console.log('*** IN REFRESH ***');
    const { data } = await getFulfilledOn(variables);
    console.log('DisputePreflightCheck:getFulfilledOn ===> ', data);
    const fulfilledOn = !data ? false : returnNestedObject(data, 'fulfilledOn');
    console.log('DisputePreflightCheck:fulfilledOn ===> ', fulfilledOn);
    if (!fulfilledOn) {
      refresh = true;
    } else {
      const now = new Date();
      const last = new Date(fulfilledOn);
      refresh = dateDiffInDays(last, now) > 0 ? true : false;
    }
    console.log('DisputePreflightCheck:refresh ===> ', refresh);
  } catch (err) {
    throw new Error(`DisputePreflightCheck:getFulfilledOn=${err}`);
  }

  if (refresh) {
    try {
      console.log('*** IN REFRESH:FULFILL ***');
      await Fulfill(accountCode, username, message, agent, auth, true);
    } catch (err) {
      throw new Error(`DisputePreflightCheck:Fulfill=${err}`);
    }
  }

  let eligible: boolean;
  try {
    console.log('*** IN GETDISPUTESTATUS ***');
    const resp = await GetDisputeStatus(accountCode, username, message, agent, auth);
    console.log('DisputePreflightCheck:GetDisputeStatus ===> ', resp);
    const type = returnNestedObject(resp, 'ResponseType');
    console.log('DisputePreflightCheck:type ===> ', type);
    eligible = type?.toLowerCase() === 'success';
    console.log('DisputePreflightCheck:eligible ===> ', eligible);
  } catch (err) {
    throw new Error(`DisputePreflightCheck:GetDisputeStatus=${err}`);
  }

  return { eligible };
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
