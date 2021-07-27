import * as he from 'he';
import * as https from 'https';
import * as fastXml from 'fast-xml-parser';
import { ajv } from 'lib/schema/validation';
import { Sync } from 'lib/utils/sync/sync';
import { SoapAid } from 'lib/utils/soap-aid/soap-aid';
import { dateDiffInDays } from 'lib/utils/dates/dates';
import { returnNestedObject } from 'lib/utils/helpers/helpers';
import { GET_INVESTIGATION_RESULTS_RESPONSE } from 'lib/examples/mocks/GetInvestigationResultsResponse';
import {
  getDataForEnrollment,
  getDataForFulfill,
  getFulfilledOn,
  getDisputeEnrollment,
  getDataForGetDisputeStatus,
  getDataForStartDispute,
  getDataForGetDisputeHistory,
  getDataForGetInvestigationResults,
} from 'lib/proxy/proxy-queries';
import {
  IFulfillResponse,
  IFulfillResult,
  IEnrollResponse,
  IEnrollResult,
  IGetAppDataRequest,
  IGetDisputeStatusResponse,
  IStartDisputeBundle,
  IStartDisputeRequest,
  IGetInvestigationEnrichPayload,
  IGetInvestigationResultsRequest,
  IGetInvestigationResultsResponse,
  IGenericRequest,
  IGetInvestigationResultsPayload,
  IGetDisputeHistoryPayload,
  IGetDisputeHistoryResponse,
  IErrorResponse,
  INil,
  IStartDisputeResponse,
  IGetDisputeStatusPayload,
  IGetServiceProductResponse,
  IFulfillPayload,
  IEnrollPayload,
  IVerifyAuthenticationQuestionsResponse,
  IGetAuthenticationQuestionsResponse,
  IIndicativeEnrichmentResponse,
} from 'lib/interfaces';
import {
  createPing,
  formatIndicativeEnrichment,
  createIndicativeEnrichment,
  formatGetAuthenticationQuestions,
  createGetAuthenticationQuestions,
  formatVerifyAuthenticationQuestions,
  createVerifyAuthenticationQuestions,
  parseEnroll,
  formatEnroll,
  createEnroll,
  createEnrollPayload,
  enrichFulfillData,
  formatFulfill,
  createFulfill,
  createFulfillPayload,
  formatGetServiceProduct,
  createGetServiceProduct,
  parseGetDisputeStatus,
  formatGetDisputeStatus,
  createGetDisputeStatus,
  createGetDisputeStatusPayload,
  parseStartDispute,
  formatStartDispute,
  createStartDispute,
  createStartDisputePayload,
  enrichDisputeData,
  formatGetDisputeHistory,
  createGetDisputeHistory,
  createGetDisputeHistoryPayload,
  parseInvestigationResults,
  formatGetInvestigationResults,
  createGetInvestigationResults,
  createGetInvestigationResultsPayload,
  enrichGetInvestigationResult,
  enrichEnrollmentData,
} from 'lib/transunion';

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
export const Ping = async (
  agent: https.Agent,
  auth: string,
): Promise<{ success: boolean; error?: IErrorResponse | INil | string; data?: any }> => {
  const soap = new SoapAid(fastXml.parse, () => {}, createPing);
  const { xml } = soap.createPackage(null, null, null);
  const request = soap.createRequestPayload(agent, auth, xml, 'Ping');
  if (!xml || !request) throw new Error(`Missing xml:${xml}, or request:${request}`);
  try {
    await soap.processRequest(request, parserOptions);
    return { success: true, error: 'ping failed' };
  } catch (err) {
    return { success: false, error: err };
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
): Promise<{ success: boolean; error: IErrorResponse | INil; data: any }> => {
  const soap = new SoapAid(fastXml.parse, formatIndicativeEnrichment, createIndicativeEnrichment);
  const { msg, xml } = soap.createPackage(accountCode, username, message);
  const request = soap.createRequestPayload(agent, auth, xml, 'IndicativeEnrichment');
  if (!msg || !xml || !request) throw new Error(`Missing msg:${msg}, xml:${xml}, or request:${request}`);
  try {
    const resp = await soap.processRequest<IIndicativeEnrichmentResponse>(request, parserOptions);
    const responseType = resp?.Envelope?.Body?.IndicativeEnrichmentResponse?.IndicativeEnrichmentResult?.ResponseType;
    const data = resp?.Envelope?.Body?.IndicativeEnrichmentResponse?.IndicativeEnrichmentResult;
    const error = resp?.Envelope?.Body?.IndicativeEnrichmentResponse?.IndicativeEnrichmentResult?.ErrorResponse;
    return responseType.toLowerCase() === 'success'
      ? { success: true, error: error, data: data }
      : { success: false, error: error, data: null };
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
): Promise<{ success: boolean; error: IErrorResponse | INil; data: any }> => {
  //create helper classes
  const soap = new SoapAid(fastXml.parse, formatGetAuthenticationQuestions, createGetAuthenticationQuestions);

  const { msg, xml } = soap.createPackage(accountCode, username, message);
  const request = soap.createRequestPayload(agent, auth, xml, 'GetAuthenticationQuestions');
  if (!msg || !xml || !request) throw new Error(`Missing msg:${msg}, xml:${xml}, or request:${request}`);
  try {
    const resp = await soap.processRequest<IGetAuthenticationQuestionsResponse>(request, parserOptions);
    const responseType =
      resp?.Envelope?.Body?.GetAuthenticationQuestionsResponse?.GetAuthenticationQuestionsResult?.ResponseType;
    const data = resp?.Envelope?.Body?.GetAuthenticationQuestionsResponse?.GetAuthenticationQuestionsResult;
    const error =
      resp?.Envelope?.Body?.GetAuthenticationQuestionsResponse?.GetAuthenticationQuestionsResult?.ErrorResponse;
    return responseType.toLowerCase() === 'success'
      ? { success: true, error: error, data: data }
      : { success: false, error: error, data: null };
  } catch (err) {
    return { success: false, error: err, data: null };
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
): Promise<{ success: boolean; error: IErrorResponse | INil; data: any }> => {
  //create helper classes
  const soap = new SoapAid(fastXml.parse, formatVerifyAuthenticationQuestions, createVerifyAuthenticationQuestions);

  const { msg, xml } = soap.createPackage(accountCode, username, message);
  const request = soap.createRequestPayload(agent, auth, xml, 'VerifyAuthenticationQuestions');
  if (!msg || !xml || !request) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${request}`);
  try {
    const resp = await soap.processRequest<IVerifyAuthenticationQuestionsResponse>(request, parserOptions);
    const responseType =
      resp?.Envelope?.Body?.VerifyAuthenticationQuestionsResponse?.VerifyAuthenticationQuestionsResult?.ResponseType;
    const data = resp?.Envelope?.Body?.VerifyAuthenticationQuestionsResponse?.VerifyAuthenticationQuestionsResult;
    const error =
      resp?.Envelope?.Body?.VerifyAuthenticationQuestionsResponse?.VerifyAuthenticationQuestionsResult?.ErrorResponse;
    return responseType.toLowerCase() === 'success'
      ? { success: true, error: error, data: data }
      : { success: false, error: error, data: null };
  } catch (err) {
    return { success: false, error: err, data: null };
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
): Promise<{ success: boolean; error?: IErrorResponse | INil | string; data?: IEnrollResult }> => {
  // validate incoming message
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

  //create helper classes
  const soap = new SoapAid(parseEnroll, formatEnroll, createEnroll, createEnrollPayload);
  const sync = new Sync(enrichEnrollmentData);

  try {
    const prepayload = await getDataForEnrollment(variables);
    const payload = soap.createPayload<IEnrollPayload>({ data: prepayload.data, dispute: dispute });
    const { msg, xml } = soap.createPackage(accountCode, username, JSON.stringify(payload));
    const request = soap.createRequestPayload(agent, auth, xml, 'Enroll');
    if (!msg || !xml || !request) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${request}`);
    const resp = await soap.processRequest<IEnrollResponse>(request, parserOptions);
    const responseType = resp?.Envelope?.Body?.EnrollResponse?.EnrollResult?.ResponseType;
    const data = resp?.Envelope?.Body?.EnrollResponse?.EnrollResult;
    const error = resp?.Envelope?.Body?.EnrollResponse?.EnrollResult?.ErrorResponse;
    console.log('enroll respn ===> ', JSON.stringify(resp));
    if (responseType.toLowerCase() === 'success') {
      const synced = await sync.syncData({ id: variables.id }, data, dispute);
      return synced
        ? { success: true, error: null, data: data }
        : { success: false, error: 'failed to sync data to db' };
    } else {
      return error.Code === '103045'
        ? { success: true, error: null, data: null }
        : { success: false, error: error, data: null };
    }
  } catch (err) {
    console.log('enroll error ===> ', err);
    return { success: false, error: err, data: null };
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
): Promise<{ success: boolean; error?: IErrorResponse | INil | string; data?: IFulfillResult }> => {
  // validate incoming message
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

  //create helper classes
  const soap = new SoapAid(fastXml.parse, formatFulfill, createFulfill, createFulfillPayload);
  const sync = new Sync(enrichFulfillData);

  try {
    // get / parse data needed to process request
    const prepayload = await getDataForFulfill(variables);
    const payload = soap.createPayload<IFulfillPayload>({ data: prepayload.data, dispute: dispute });
    const { msg, xml } = soap.createPackage(accountCode, username, JSON.stringify(payload));
    const request = soap.createRequestPayload(agent, auth, xml, 'Fulfill');
    if (!msg || !xml || !request) throw new Error(`Missing msg:${msg}, xml:${xml}, or request:${request}`);
    const resp = await soap.processRequest<IFulfillResponse>(request, parserOptions);
    const responseType = resp?.Envelope?.Body?.FulfillResponse?.FulfillResult?.ResponseType;
    const data = resp?.Envelope?.Body?.FulfillResponse?.FulfillResult;
    const error = resp?.Envelope?.Body?.FulfillResponse?.FulfillResult?.ErrorResponse;
    if (responseType.toLowerCase() === 'success') {
      const synced = await sync.syncData({ id: variables.id }, data, dispute);
      return synced
        ? { success: true, error: null, data: data }
        : { success: false, error: 'failed to sync data to db' };
    } else {
      return { success: false, error: error };
    }
  } catch (err) {
    return { success: false, error: err };
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
): Promise<{ success: boolean; error: IErrorResponse | INil; data: any }> => {
  // TODO add validation

  try {
    // create helper classes
    const soap = new SoapAid(fastXml.parse, formatGetServiceProduct, createGetServiceProduct);
    const { msg, xml } = soap.createPackage(accountCode, username, message);
    const request = soap.createRequestPayload(agent, auth, xml, 'GetServiceProduct');
    if (!msg || !xml || !request) throw new Error(`Missing msg:${msg}, xml:${xml}, or request:${request}`);
    const resp = await soap.processRequest<IGetServiceProductResponse>(request, parserOptions);
    const responseType = resp?.Envelope?.Body?.GetServiceProductResponse?.GetServiceProductResult?.ResponseType;
    const data = resp?.Envelope?.Body?.GetServiceProductResponse?.GetServiceProductResult;
    const error = resp?.Envelope?.Body?.GetServiceProductResponse?.GetServiceProductResult?.ErrorResponse;
    return responseType.toLowerCase() === 'success'
      ? { success: true, error: error, data: data }
      : { success: false, error: error, data: null };
  } catch (err) {
    return { success: false, error: err, data: null };
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
): Promise<{ success: boolean; error?: IErrorResponse | INil; data?: any }> => {
  // validate incoming message
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

  //create helper classes
  const soap = new SoapAid(
    parseGetDisputeStatus,
    formatGetDisputeStatus,
    createGetDisputeStatus,
    createGetDisputeStatusPayload,
  );

  try {
    // get / parse data needed to process request
    const prepayload = await getDataForGetDisputeStatus(variables);
    const payload = soap.createPayload<IGetDisputeStatusPayload>(prepayload.data);
    const { msg, xml } = soap.createPackage(accountCode, username, JSON.stringify(payload));
    const request = soap.createRequestPayload(agent, auth, xml, 'GetDisputeStatus');
    if (!msg || !xml || !request) throw new Error(`Missing msg:${msg}, xml:${xml}, or request:${request}`);
    const resp = await soap.processRequest<IGetDisputeStatusResponse>(request, parserOptions);
    const responseType = resp?.Envelope?.Body?.GetDisputeStatusResponse?.GetDisputeStatusResult?.ResponseType;
    const data = resp?.Envelope?.Body?.GetDisputeStatusResponse?.GetDisputeStatusResult;
    const error = resp?.Envelope?.Body?.GetDisputeStatusResponse?.GetDisputeStatusResult?.ErrorResponse;
    return responseType.toLowerCase() === 'success'
      ? { success: true, error: error, data: data }
      : { success: false, error: error, data: null };
  } catch (err) {
    return { success: false, error: err, data: null };
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
  // validate incoming message
  let variables: IStartDisputeRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<IStartDisputeRequest>('startDisputeRequest');
  if (!validate(variables)) throw `Malformed message=${message}`;

  //create helper classes
  const soap = new SoapAid(parseStartDispute, formatStartDispute, createStartDispute, createStartDisputePayload);
  const sync = new Sync(enrichDisputeData);

  try {
    console.log('*** IN START DISPUTE ***');
    const prepayload = await getDataForStartDispute(variables);
    const payload = soap.createPayload({ data: prepayload.data, disputes: variables.disputes });
    const { msg, xml } = soap.createPackage(accountCode, username, JSON.stringify(payload));
    const request = soap.createRequestPayload(agent, auth, xml, 'StartDispute');
    if (!msg || !xml || !request) throw new Error(`Missing msg:${msg}, xml:${xml}, or request:${request}`);
    const resp = await soap.processRequest<IStartDisputeResponse>(request, parserOptions);
    const responseType = resp?.Envelope?.Body?.StartDisputeResponse?.StartDisputeResult?.ResponseType;
    const data = resp?.Envelope?.Body?.StartDisputeResponse?.StartDisputeResult;
    const error = resp?.Envelope?.Body?.StartDisputeResponse?.StartDisputeResult?.ErrorResponse;
    const bundle: IStartDisputeBundle = {
      startDisputeResult: data,
      disputes: variables.disputes,
    };
    if (responseType.toLowerCase() === 'success') {
      const synced = await sync.syncData({ id: variables.id }, bundle);
      return synced ? { success: true, error: null } : { success: false, error: 'failed to sync data to db' };
    } else {
      return { success: false, error: error };
    }
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
): Promise<{ success: boolean; error: IErrorResponse | INil; data: any }> => {
  // validate incoming message
  let variables: IGenericRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<IGenericRequest>('getRequest');
  if (!validate(variables)) throw `Malformed message=${message}`;

  //create helper classes
  const soap = new SoapAid(
    fastXml.parse,
    formatGetDisputeHistory,
    createGetDisputeHistory,
    createGetDisputeHistoryPayload,
  );

  try {
    // get / parse data needed to process request
    const prepayload = await getDataForGetDisputeHistory(variables); // same data
    const payload = soap.createPayload<IGetDisputeHistoryPayload>(prepayload.data);
    const { msg, xml } = soap.createPackage(accountCode, username, JSON.stringify(payload));
    const request = soap.createRequestPayload(agent, auth, xml, 'GetDisputeHistory');
    if (!msg || !xml || !request) throw new Error(`Missing msg:${msg}, xml:${xml}, or request:${request}`);
    // process request and sync response to db
    const resp = await soap.processRequest<IGetDisputeHistoryResponse>(request, parserOptions);
    const responseType = resp?.Envelope?.Body?.GetDisputeHistoryResponse?.GetDisputeHistoryResult?.ResponseType;
    const data = resp?.Envelope?.Body?.GetDisputeHistoryResponse?.GetDisputeHistoryResult;
    const error = resp?.Envelope?.Body?.GetDisputeHistoryResponse?.GetDisputeHistoryResult?.ErrorResponse;
    return responseType.toLowerCase() === 'success'
      ? { success: true, error: error, data: data }
      : { success: false, error: error, data: null };
  } catch (err) {
    return { success: false, error: err, data: null };
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
): Promise<{ success: boolean; error?: any; data?: any }> => {
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

  try {
    // get / parse data needed
    const prepayload = await getDataForGetInvestigationResults(variables); // same data
    const payload = soap.createPayload<IGetInvestigationResultsPayload>(prepayload.data, variables.disputeId);
    const { msg, xml } = soap.createPackage(accountCode, username, JSON.stringify(payload));
    const request = soap.createRequestPayload(agent, auth, xml, 'GetInvestigationResults');

    if (!msg || !xml || !request) throw new Error(`Missing msg:${msg}, xml:${xml}, or options:${request}`);
    // const parsed = await processRequest(options, parseInvestigationResults, parserOptions);
    const resp = await soap.processMockRequest<IGetInvestigationResultsResponse>(
      GET_INVESTIGATION_RESULTS_RESPONSE,
      parserOptions,
    );
    const responseType =
      resp.Envelope?.Body?.GetInvestigationResultsResponse?.GetInvestigationResultsResult?.ResponseType;
    const data = resp?.Envelope?.Body?.GetInvestigationResultsResponse?.GetInvestigationResultsResult;
    const error = resp?.Envelope?.Body?.GetInvestigationResultsResponse?.GetInvestigationResultsResult?.ErrorResponse;
    const bundle: IGetInvestigationEnrichPayload = {
      disputeId: variables.disputeId,
      getInvestigationResult: data,
    };

    if (responseType.toLowerCase() === 'success') {
      const synced = await sync.syncData({ id: variables.id }, bundle);
      return synced ? { success: true, error: null } : { success: false, error: 'failed to sync data to db' };
    } else {
      return { success: false, error: error };
    }
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
): Promise<{ success: Boolean; error?: any; data?: IFulfillResult }> => {
  let variables: IGetAppDataRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<IGetAppDataRequest>('getAppDataRequest');
  if (!validate(variables)) throw `Malformed message=${message}`;

  try {
    const {
      success: enrollSuccess,
      error: enrollError,
      data: enrollData,
    } = await Enroll(accountCode, username, message, agent, auth, false); // report & score enroll
    console.log('enrollment results:success ====> ', enrollSuccess);
    console.log('enrollment results:error ====> ', enrollError);
    console.log('enrollment results:enrollData ====> ', enrollData);
    if (!enrollSuccess) return { success: false, error: enrollError };
    const {
      success: disputeSuccess,
      error: disputeError,
      data: disputeEnroll,
    } = await Enroll(accountCode, username, message, agent, auth, true); // dispute enroll
    console.log('enrollment disputes:success ====> ', disputeSuccess);
    console.log('enrollment disputes:error ====> ', disputeError);
    console.log('enrollment disputes:enrollData ====> ', disputeEnroll);
    if (!disputeSuccess) return { success: false, error: disputeError };
    const {
      success: fulfillSuccess,
      error: fulfillError,
      data: fulfill,
    } = await Fulfill(accountCode, username, message, agent, auth, true);
    console.log('enrollment fulfill:success ====> ', fulfillSuccess);
    console.log('enrollment fulfill:error ====> ', fulfillError);
    console.log('enrollment fulfill:enrollData ====> ', fulfill);
    return fulfillSuccess ? { success: true, error: null, data: fulfill } : { success: false, error: fulfillError };
  } catch (err) {
    return { success: false, error: err, data: null };
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
      const { success, error, data } = await Enroll(accountCode, username, message, agent, auth, true);
      if (!success) return { success: false, error: error };
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
    console.log('*** IN REFRESH:FULFILL ***');
    try {
      const { success, error } = await Fulfill(accountCode, username, message, agent, auth, true);
      if (!success) return { success: false, error: error };
    } catch (err) {
      return { success: false, error: err };
    }
  }

  try {
    console.log('*** IN GETDISPUTESTATUS ***');
    const { success, error } = await GetDisputeStatus(accountCode, username, message, agent, auth);
    return success ? { success: true } : { success: false, error: error };
  } catch (err) {
    return { success: false, error: err };
  }
};
