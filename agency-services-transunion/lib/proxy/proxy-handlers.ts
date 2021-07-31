import * as he from 'he';
import * as https from 'https';
import * as fastXml from 'fast-xml-parser';
import { ajv } from 'lib/schema/validation';
import { Sync } from 'lib/utils/sync/sync';
import { SoapAid } from 'lib/utils/soap-aid/soap-aid';
import { dateDiffInDays } from 'lib/utils/dates/dates';
import { returnNestedObject } from 'lib/utils/helpers/helpers';
import { GET_INVESTIGATION_RESULTS_RESPONSE } from 'lib/examples/mocks/GetInvestigationResultsResponse';
import * as qrys from 'lib/proxy/proxy-queries';
import * as itfs from 'lib/interfaces';
import * as tu from 'lib/transunion';

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
): Promise<{ success: boolean; error?: itfs.IErrorResponse | itfs.INil | string; data?: any }> => {
  const soap = new SoapAid(fastXml.parse, () => {}, tu.createPing);
  try {
    const { xml } = soap.createPackage(null, null, null);
    const request = soap.createRequestPayload(agent, auth, xml, 'Ping');
    if (!xml || !request) throw new Error(`Missing xml:${xml}, or request:${request}`);
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
): Promise<{ success: boolean; error: itfs.IErrorResponse | itfs.INil; data: any }> => {
  //create helper
  const soap = new SoapAid(fastXml.parse, tu.formatIndicativeEnrichment, tu.createIndicativeEnrichment);
  try {
    const resp = await soap.parseAndSendPayload<itfs.IIndicativeEnrichmentResponse>(
      accountCode,
      username,
      agent,
      auth,
      JSON.parse(message),
      'IndicativeEnrichment',
      parserOptions,
    );

    const data = returnNestedObject<itfs.IIndicativeEnrichmentResult>(resp, 'IndicativeEnrichmentResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

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
): Promise<{ success: boolean; error: itfs.IErrorResponse | itfs.INil; data: any }> => {
  //create helper classes
  const soap = new SoapAid(fastXml.parse, tu.formatGetAuthenticationQuestions, tu.createGetAuthenticationQuestions);

  try {
    const resp = await soap.parseAndSendPayload<itfs.IGetAuthenticationQuestionsResponse>(
      accountCode,
      username,
      agent,
      auth,
      JSON.parse(message),
      'GetAuthenticationQuestions',
      parserOptions,
    );

    const data = returnNestedObject<itfs.IGetAuthenticationQuestionsResult>(resp, 'GetAuthenticationQuestionsResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

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
): Promise<{ success: boolean; error: itfs.IErrorResponse | itfs.INil; data: any }> => {
  //create helper classes
  const soap = new SoapAid(
    fastXml.parse,
    tu.formatVerifyAuthenticationQuestions,
    tu.createVerifyAuthenticationQuestions,
  );

  try {
    const resp = await soap.parseAndSendPayload<itfs.IVerifyAuthenticationQuestionsResponse>(
      accountCode,
      username,
      agent,
      auth,
      JSON.parse(message),
      'VerifyAuthenticationQuestions',
      parserOptions,
    );

    const data = returnNestedObject<itfs.IVerifyAuthenticationQuestionsResult>(
      resp,
      'VerifyAuthenticationQuestionsResult',
    );
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

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
): Promise<{ success: boolean; error?: itfs.IErrorResponse | itfs.INil | string; data?: itfs.IEnrollResult }> => {
  // validate incoming message
  let variables: itfs.IGetAppDataRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<itfs.IGetAppDataRequest>('getAppDataRequest');
  if (!validate(variables)) {
    let id = returnNestedObject<string>(JSON.parse(message), 'ClientKey'); // try to remedy
    variables = {
      id: `us-east-2:${id}`,
    };
    if (!validate(variables)) throw `Malformed message=${message}`;
  }

  //create helper classes
  const soap = new SoapAid(tu.parseEnroll, tu.formatEnroll, tu.createEnroll, tu.createEnrollPayload);
  const sync = new Sync(tu.enrichEnrollmentData);

  try {
    const prepayload = await qrys.getDataForEnrollment(variables);
    console.log('prepayload ===> ', prepayload.data);
    const resp = await soap.parseAndSendPayload<itfs.IEnrollResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepayload.data,
      'Enroll',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<itfs.IEnrollResult>(resp, 'EnrollResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

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
 * After verification the user is eligible to enroll.
 * Enrolls user and returns merge report and vantage score
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Enrollment message format...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const EnrollDisputes = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
  dispute: boolean = false,
): Promise<{ success: boolean; error?: itfs.IErrorResponse | itfs.INil | string; data?: itfs.IEnrollResult }> => {
  // validate incoming message
  let variables: itfs.IGetAppDataRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<itfs.IGetAppDataRequest>('getAppDataRequest');
  if (!validate(variables)) {
    let id = returnNestedObject<string>(JSON.parse(message), 'ClientKey'); // try to remedy
    variables = {
      id: `us-east-2:${id}`,
    };
    if (!validate(variables)) throw `Malformed message=${message}`;
  }

  //create helper classes
  const soap = new SoapAid(
    tu.parseEnrollDisputes,
    tu.formatEnrollDisputes,
    tu.createEnrollDisputes,
    tu.createEnrollDisputesPayload,
  );
  const sync = new Sync(tu.enrichEnrollDisputesData);

  try {
    const prepayload = await qrys.getDataForEnrollment(variables);
    const resp = await soap.parseAndSendPayload<itfs.IEnrollResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepayload.data,
      'Enroll',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<itfs.IEnrollResult>(resp, 'EnrollResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

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
): Promise<{ success: boolean; error?: itfs.IErrorResponse | itfs.INil | string; data?: itfs.IFulfillResult }> => {
  // validate incoming message
  let variables: itfs.IGetAppDataRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<itfs.IGetAppDataRequest>('getAppDataRequest');
  if (!validate(variables)) {
    let id = returnNestedObject<string>(JSON.parse(message), 'ClientKey'); // try to remedy
    variables = {
      id: `us-east-2:${id}`,
    };
    if (!validate(variables)) throw `Malformed message=${message}`;
  }

  //create helper classes
  const soap = new SoapAid(tu.parseFulfill, tu.formatFulfill, tu.createFulfill, tu.createFulfillPayload);
  const sync = new Sync(tu.enrichFulfillData);

  try {
    // get / parse data needed to process request
    const prepayload = await qrys.getDataForFulfill(variables);
    const resp = await soap.parseAndSendPayload<itfs.IFulfillResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepayload.data,
      'Fulfill',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<itfs.IFulfillResult>(resp, 'FulfillResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

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
 * A returning user can refresh their report by calling fulfill
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Full message format (fullfillment key required)...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const FulfillDisputes = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
  dispute: boolean = false,
): Promise<{ success: boolean; error?: itfs.IErrorResponse | itfs.INil | string; data?: itfs.IFulfillResult }> => {
  // validate incoming message
  let variables: itfs.IGetAppDataRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<itfs.IGetAppDataRequest>('getAppDataRequest');
  if (!validate(variables)) {
    let id = returnNestedObject<string>(JSON.parse(message), 'ClientKey'); // try to remedy
    variables = {
      id: `us-east-2:${id}`,
    };
    if (!validate(variables)) throw `Malformed message=${message}`;
  }

  //create helper classes
  const soap = new SoapAid(
    tu.parseFulfillDisputes,
    tu.formatFulfillDisputes,
    tu.createFulfillDisputes,
    tu.createFulfillDisputesPayload,
  );
  const sync = new Sync(tu.enrichFulfillDisputesData);

  try {
    // get / parse data needed to process request
    const prepayload = await qrys.getDataForFulfill(variables);
    const resp = await soap.parseAndSendPayload<itfs.IFulfillResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepayload.data,
      'Fulfill',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<itfs.IFulfillResult>(resp, 'FulfillResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

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
): Promise<{ success: boolean; error: itfs.IErrorResponse | itfs.INil; data: any }> => {
  // TODO add validation
  const soap = new SoapAid(fastXml.parse, tu.formatGetServiceProduct, tu.createGetServiceProduct);

  try {
    // create helper classes
    const resp = await soap.parseAndSendPayload<itfs.IGetServiceProductResponse>(
      accountCode,
      username,
      agent,
      auth,
      JSON.parse(message),
      'GetServiceProduct',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<itfs.IGetServiceProductResult>(resp, 'GetServiceProductResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

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
): Promise<{ success: boolean; error?: itfs.IErrorResponse | itfs.INil; data?: any }> => {
  // validate incoming message
  let variables: itfs.IGetAppDataRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<itfs.IGetAppDataRequest>('getAppDataRequest');
  if (!validate(variables)) {
    let id = returnNestedObject<string>(JSON.parse(message), 'ClientKey'); // try to remedy
    variables = {
      id: `us-east-2:${id}`,
    };
    if (!validate(variables)) throw `Malformed message=${message}`;
  }

  //create helper classes
  const soap = new SoapAid(
    tu.parseGetDisputeStatus,
    tu.formatGetDisputeStatus,
    tu.createGetDisputeStatus,
    tu.createGetDisputeStatusPayload,
  );

  try {
    // get / parse data needed to process request
    const prepayload = await qrys.getDataForGetDisputeStatus(variables);
    const resp = await soap.parseAndSendPayload<itfs.IGetDisputeStatusResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepayload.data,
      'GetDisputeStatus',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<itfs.IGetDisputeStatusResult>(resp, 'GetDisputeStatusResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

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
  let variables: itfs.IStartDisputeRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<itfs.IStartDisputeRequest>('startDisputeRequest');
  if (!validate(variables)) throw `Malformed message=${message}`;

  //create helper classes
  const soap = new SoapAid(
    tu.parseStartDispute,
    tu.formatStartDispute,
    tu.createStartDispute,
    tu.createStartDisputePayload,
  );
  const sync = new Sync(tu.enrichDisputeData);

  try {
    console.log('*** IN START DISPUTE ***');
    const prepayload = await qrys.getDataForStartDispute(variables);
    const payload = { data: prepayload.data, disputes: variables.disputes };
    const resp = await soap.parseAndSendPayload<itfs.IStartDisputeResponse>(
      accountCode,
      username,
      agent,
      auth,
      payload,
      'StartDispute',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<itfs.IStartDisputeResult>(resp, 'StartDisputeResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;
    const bundle: itfs.IStartDisputeBundle = {
      startDisputeResult: data,
      disputes: variables.disputes,
    };

    console.log('start dispute response data ===> ', JSON.stringify(data));
    console.log('start dispute response type ===> ', JSON.stringify(responseType));
    console.log('start dispute response error ===> ', JSON.stringify(error));

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
): Promise<{ success: boolean; error: itfs.IErrorResponse | itfs.INil; data: any }> => {
  // validate incoming message
  let variables: itfs.IGenericRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<itfs.IGenericRequest>('getRequest');
  if (!validate(variables)) throw `Malformed message=${message}`;

  //create helper classes
  const soap = new SoapAid(
    fastXml.parse,
    tu.formatGetDisputeHistory,
    tu.createGetDisputeHistory,
    tu.createGetDisputeHistoryPayload,
  );

  try {
    // get / parse data needed to process request
    const prepayload = await qrys.getDataForGetDisputeHistory(variables); // same data
    const resp = await soap.parseAndSendPayload<itfs.IGetDisputeHistoryResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepayload.data,
      'GetDisputeHistory',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<itfs.IGetDisputeHistoryResult>(resp, 'GetDisputeHistoryResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

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
  let variables: itfs.IGetInvestigationResultsRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<itfs.IGetInvestigationResultsRequest>('getInvestigationResultsRequest');
  if (!validate(variables)) throw `Malformed message=${message}`;

  //create helper classes
  const sync = new Sync(tu.enrichGetInvestigationResult);
  const soap = new SoapAid(
    tu.parseInvestigationResults,
    tu.formatGetInvestigationResults,
    tu.createGetInvestigationResults,
    tu.createGetInvestigationResultsPayload,
  );

  try {
    // get / parse data needed
    const prepayload = await qrys.getDataForGetInvestigationResults(variables); // same data
    const payload = { data: prepayload.data, disputeId: variables.disputeId };
    // const resp = await soap.parseAndSendPayload<IGetInvestigationResultsResponse>(
    //   accountCode,
    //   username,
    //   agent,
    //   auth,
    //   payload,
    //   'GetInvestigationResults',
    //   parserOptions,
    // );

    const resp = await soap.processMockRequest<itfs.IGetInvestigationResultsResponse>(
      GET_INVESTIGATION_RESULTS_RESPONSE,
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<itfs.IGetInvestigationResultsResult>(resp, 'GetInvestigationResultsResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;
    const bundle: itfs.IGetInvestigationEnrichPayload = {
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
): Promise<{ success: Boolean; error?: any; data?: itfs.IEnrollResult }> => {
  let variables: itfs.IGetAppDataRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<itfs.IGetAppDataRequest>('getAppDataRequest');
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
    return enrollSuccess ? { success: true, error: null, data: enrollData } : { success: false, error: enrollError };
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
  let variables: itfs.IGetAppDataRequest = {
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<itfs.IGetAppDataRequest>('getAppDataRequest');
  if (!validate(variables)) throw `Malformed message=${message}`;

  let enrolled: boolean;
  try {
    console.log('*** IN GET ENROLL STATUS ***');
    const { data } = await qrys.getDisputeEnrollment(variables);
    enrolled = !data ? false : returnNestedObject<boolean>(data, 'disputeEnrolled');
    console.log('DisputePreflightCheck:enrolled ===> ', enrolled);
  } catch (err) {
    return { success: false, error: err };
  }

  if (!enrolled) {
    console.log('*** IN ENROLL ***');
    try {
      const { success, error, data } = await EnrollDisputes(accountCode, username, message, agent, auth);
      if (!success) return { success: false, error: error };
    } catch (err) {
      return { success: false, error: err };
    }
  }

  let refresh: boolean;
  try {
    console.log('*** IN REFRESH ***');
    const { data } = await qrys.getFulfilledOn(variables);
    const fulfilledOn = !data ? false : returnNestedObject<string>(data, 'fulfilledOn');
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
      const { success, error } = await FulfillDisputes(accountCode, username, message, agent, auth);
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
