import {
  formatEnroll,
  createEnroll,
  parseEnroll,
  createEnrollPayload,
  enrichEnrollmentData,
} from 'lib/transunion/enroll/enroll';
import {
  formatFulfill,
  createFulfill,
  parseFulfill,
  createFulfillPayload,
  enrichFulfillData,
} from 'lib/transunion/fulfill/fulfill';
import {
  formatGetAuthenticationQuestions,
  createGetAuthenticationQuestions,
} from 'lib/transunion/authentication-questions/get-authentication-questions';
import {
  formatGetDisputeStatus,
  createGetDisputeStatus,
  parseGetDisputeStatus,
  createGetDisputeStatusPayload,
} from 'lib/transunion/dispute-status/get-dispute-status';
import { formatGetServiceProduct, createGetServiceProduct } from 'lib/transunion/service-product/get-service-product';
import {
  formatIndicativeEnrichment,
  createIndicativeEnrichment,
} from 'lib/transunion/indicative-enrichment/indicative-enrichment';
import { createPing } from 'lib/transunion/ping/ping';
import {
  formatVerifyAuthenticationQuestions,
  createVerifyAuthenticationQuestions,
} from 'lib/transunion/authentication-questions-verify/verify-authentication-questions';
import {
  createPackage,
  createRequestOptions,
  processMockRequest,
  processRequest,
  returnNestedObject,
  syncData,
} from 'lib/utils/helpers/helpers';
import * as uuid from 'uuid';
import * as https from 'https';
import * as fastXml from 'fast-xml-parser';
import {
  createStartDispute,
  createStartDisputePayload,
  enrichDisputeData,
  formatStartDispute,
  parseStartDispute,
} from 'lib/transunion/start-dispute/start-dispute';
import {
  createGetDisputeHistory,
  createGetDisputeHistoryPayload,
  formatGetDisputeHistory,
} from 'lib/transunion/dispute-history/get-dispute-history';
import {
  formatGetInvestigationResults,
  createGetInvestigationResults,
  createGetInvestigationResultsPayload,
  enrichGetInvestigationResult,
  parseInvestigationResults,
} from 'lib/transunion/investigation-results/investigation-results';
import { ajv } from 'lib/schema/validation';
import {
  getEnrollment,
  getDataForEnrollment,
  getDataForFulfill,
  getFulfilledOn,
  getDisputeEnrollment,
  getDataForGetDisputeStatus,
  getDataForStartDispute,
  getDataForGetDisputeHistory,
  getDataForGetInvestigationResults,
  getAppData,
} from 'lib/proxy/proxy-queries';
import { dateDiffInDays } from 'lib/utils/dates/dates';
import {
  IFulfillGraphQLResponse,
  IFulfillResponse,
  IFulfillResult,
  IEnrollGraphQLResponse,
  IEnrollResponse,
  IEnrollResult,
  IGetAppDataRequest,
  IGetDisputeStatusGraphQLResponse,
  IGetDisputeStatusResponse,
  IStartDisputeBundle,
  IStartDisputeGraphQLResponse,
  IStartDisputeRequest,
  IStartDisputeResult,
  IGetInvestigationEnrichPayload,
  IGetInvestigationResult,
  IGetInvestigationResultsGraphQLResponse,
  IGetInvestigationResultsRequest,
  IGetDisputeHistoryGraphQLResponse,
  IGenericRequest,
  IGetInvestigationResultsPayload,
} from 'lib/interfaces';
import { GET_INVESTIGATION_RESULTS_RESPONSE } from 'lib/examples/mocks/GetInvestigationResultsResponse';
import * as he from 'he';
import { SoapAid } from 'lib/utils/soap-aid/soap-aid';
import { Sync } from 'lib/utils/sync/sync';

const parserOptions = {
  attributeNamePrefix: '',
  ignoreAttributes: false,
  ignoreNameSpace: true,
  parseAttributeValue: true,
  attrValueProcessor: (val, attrName) => he.encode(val, { isAttributeValue: true }), //default is a=>a
  tagValueProcessor: (val, tagName) => he.encode(val), //default is a=>a
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
    console.log('enroll response ===> ', enroll);
    const enrollResults: IEnrollResult = returnNestedObject(enroll, 'EnrollResult');
    if (enrollResults?.ResponseType.toLowerCase() === 'success') {
      await syncData(variables, enrollResults, enrichEnrollmentData, dispute);
    } else {
      if (enrollResults?.ErrorResponse['Code'] === '103045') {
        return; // already enrolled...bypass
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
    console.log('fulfillResults ===> ', fulfillResults);
    if (fulfillResults?.ResponseType.toLowerCase() === 'success') {
      const fulfillSync = await syncData(variables, fulfillResults, enrichFulfillData, dispute);
      console.log('fulfilSync ===> ', fulfillSync);
    }
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
    const resp = await getDataForGetDisputeStatus(variables);
    const gql: IGetDisputeStatusGraphQLResponse = resp.data; // add validation here
    const payload = createGetDisputeStatusPayload(gql);
    const { msg, xml } = createPackage(
      accountCode,
      username,
      JSON.stringify(payload),
      formatGetDisputeStatus,
      createGetDisputeStatus,
    );
    const options = createRequestOptions(agent, auth, xml, 'GetDisputeStatus');
    if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
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
): Promise<{ success: boolean; error?: any }> => {
  let variables: IStartDisputeRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<IStartDisputeRequest>('startDisputeRequest');
  if (!validate(variables)) throw `Malformed message=${message}`;

  try {
    console.log('*** IN START DISPUTE ***');
    const resp = await getDataForStartDispute(variables);
    const gql: IStartDisputeGraphQLResponse = resp.data;
    console.log('StartDispute:gql ===> ', JSON.stringify(gql));
    const payload = createStartDisputePayload(gql, variables.disputes);
    const { msg, xml } = createPackage(
      accountCode,
      username,
      JSON.stringify(payload),
      formatStartDispute,
      createStartDispute,
    );
    const options = createRequestOptions(agent, auth, xml, 'StartDispute');
    if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
    const dispute = await processRequest(options, parseStartDispute, parserOptions);
    const disputeResults: IStartDisputeResult = returnNestedObject(dispute, 'StartDisputeResult');
    const started = disputeResults?.ResponseType.toLowerCase() === 'success';
    const bundle: IStartDisputeBundle = {
      startDisputeResult: disputeResults,
      disputes: variables.disputes,
    };
    if (started) {
      await syncData({ id: variables.id }, bundle, enrichDisputeData);
    }
    return started ? { success: true } : { success: false, error: disputeResults.ErrorResponse };
  } catch (err) {
    return { success: false, error: err };
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
  let variables: IGenericRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<IGenericRequest>('getRequest');
  if (!validate(variables)) throw `Malformed message=${message}`;

  const resp = await getDataForGetDisputeHistory(variables); // same data
  const gql: IGetDisputeHistoryGraphQLResponse = resp.data; // add validation here
  const payload = createGetDisputeHistoryPayload(gql);
  const { msg, xml } = createPackage(
    accountCode,
    username,
    JSON.stringify(payload),
    formatGetDisputeHistory,
    createGetDisputeHistory,
  );
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
): Promise<{ success: boolean; error?: any }> => {
  // validate incoming message
  let variables: IGetInvestigationResultsRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<IGetInvestigationResultsRequest>('getInvestigationResultsRequest');
  if (!validate(variables)) throw `Malformed message=${message}`;

  //create helper classes
  const soap = new SoapAid(
    parseInvestigationResults,
    formatGetInvestigationResults,
    createGetInvestigationResults,
    createGetInvestigationResultsPayload,
  );
  const sync = new Sync(enrichGetInvestigationResult);

  // get / parse data needed
  const resp = await getDataForGetInvestigationResults(variables); // same data
  const payload = soap.createPayload<IGetInvestigationResultsPayload>(resp.data, variables.disputeId);
  const { msg, xml } = soap.createPackage(accountCode, username, JSON.stringify(payload));
  const options = soap.createRequestOptions(agent, auth, xml, 'GetInvestigationResults');

  if (!msg || !xml || !options) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${options}`);
  try {
    // const parsed = await processRequest(options, parseInvestigationResults, parserOptions);
    const investigation = await soap.processMockRequest<any>(GET_INVESTIGATION_RESULTS_RESPONSE, parserOptions);
    const investigationResults: IGetInvestigationResult = returnNestedObject(
      investigation,
      'GetInvestigationResultsResult',
    );
    const responded = investigationResults?.ResponseType.toLowerCase() === 'success';
    if (responded) {
      const bundle: IGetInvestigationEnrichPayload = {
        disputeId: variables.disputeId,
        getInvestigationResult: investigationResults,
      };
      const synced = await sync.syncData({ id: variables.id }, bundle);
      return synced ? { success: true } : { success: false, error: investigationResults.ErrorResponse };
    }
    return { success: false, error: 'failed db sync' };
  } catch (err) {
    return { success: false, error: err };
  }
};

export const CompleteOnboardingEnrollments = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
): Promise<{ success: Boolean; error?: any }> => {
  let variables: IGetAppDataRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<IGetAppDataRequest>('getAppDataRequest');
  if (!validate(variables)) throw `Malformed message=${message}`;
  try {
    const enroll = await Enroll(accountCode, username, message, agent, auth, false); // report & score enroll
    if (enroll?.EnrollResult?.ResponseType.toLowerCase() !== 'success')
      return { success: false, error: enroll.EnrollResult.ErrorResponse };
    const disputeEnroll = await Enroll(accountCode, username, message, agent, auth, true); // dispute enroll
    if (disputeEnroll?.EnrollResult?.ResponseType.toLowerCase() !== 'success')
      return { success: false, error: disputeEnroll.EnrollResult.ErrorResponse };
    const fulfill = await Fulfill(accountCode, username, message, agent, auth, true);
    const fulfillResults: IFulfillResult = returnNestedObject(fulfill, 'FulfillResult');
    const onboarded = fulfillResults?.ResponseType.toLowerCase() !== 'success';
    console.log(
      'onboarding results ===> ',
      onboarded ? { success: true } : { success: false, error: fulfill.FulfillResult.ErrorResponse },
    );
    return onboarded ? { success: true } : { success: false, error: fulfill.FulfillResult.ErrorResponse };
  } catch (err) {
    return { success: false, error: err };
  }
};

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
): Promise<{ success: boolean; error?: any }> => {
  let variables: IGetAppDataRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<IGetAppDataRequest>('getAppDataRequest');
  if (!validate(variables)) throw `Malformed message=${message}`;

  let enrolled: boolean;
  try {
    console.log('*** IN GET ENROLL STATUS ***');
    const { data } = await getDisputeEnrollment(variables);
    enrolled = !data ? false : returnNestedObject(data, 'disputeEnrolled');
    console.log('DisputePreflightCheck:enrolled ===> ', enrolled);
  } catch (err) {
    return { success: false, error: err };
  }

  if (!enrolled) {
    console.log('*** IN ENROLL ***');
    try {
      const resp = await Enroll(accountCode, username, message, agent, auth, true);
      const type = resp.EnrollResult.ResponseType;
      const enrolled = type?.toLowerCase() !== 'success';
      if (!enrolled) {
        return { success: false, error: resp.EnrollResult.ErrorResponse };
      }
    } catch (err) {
      return { success: false, error: err };
    }
  }

  let refresh: boolean;
  try {
    console.log('*** IN REFRESH ***');
    const { data } = await getFulfilledOn(variables);
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
    return { success: false, error: err };
  }

  if (refresh) {
    try {
      console.log('*** IN REFRESH:FULFILL ***');
      await Fulfill(accountCode, username, message, agent, auth, true);
    } catch (err) {
      return { success: false, error: err };
    }
  }

  let eligible: boolean;
  try {
    console.log('*** IN GETDISPUTESTATUS ***');
    const resp = await GetDisputeStatus(accountCode, username, message, agent, auth);
    const type = resp.GetDisputeStatusResult.ResponseType; //returnNestedObject(resp, 'ResponseType');
    eligible = type?.toLowerCase() === 'success';
    console.log('DisputePreflightCheck:eligible ===> ', eligible);
    return eligible ? { success: true } : { success: false, error: resp.GetDisputeStatusResult.ErrorResponse };
  } catch (err) {
    return { success: false, error: err };
  }
};
