import * as he from 'he';
import * as https from 'https';
import * as fastXml from 'fast-xml-parser';
import { ajv } from 'lib/schema/validation';
import { Sync } from 'lib/utils/sync/sync';
import { SoapAid } from 'lib/utils/soap-aid/soap-aid';
import { dateDiffInDays, dateDiffInHours } from 'lib/utils/dates/dates';
import { returnNestedObject } from 'lib/utils/helpers/helpers';
import { GET_INVESTIGATION_RESULTS_RESPONSE } from 'lib/examples/mocks/GetInvestigationResultsResponse';
import * as qrys from 'lib/proxy/proxy-queries';
import * as interfaces from 'lib/interfaces';
import * as tu from 'lib/transunion';
import { START_DISPUTE_RESPONSE } from 'lib/examples/mocks/StartDisputeResponse';
import { GET_ALERT_NOTIFICATIONS_RESPONSE } from 'lib/examples/mocks/GetAlertNotificationsResponse';

const GO_LIVE = false;

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
  identityId: string,
): Promise<{ success: boolean; error?: interfaces.IErrorResponse | interfaces.INil | string; data?: any }> => {
  const soap = new SoapAid(fastXml.parse, () => {}, tu.createPing);
  try {
    const { xml } = soap.createPackage(null, null, null);
    const request = soap.createRequestPayload(agent, auth, xml, 'Ping');
    if (!xml || !request) throw new Error(`Missing xml:${xml}, or request:${request}`);
    await soap.processRequest(request, parserOptions);
    return { success: true, error: null, data: 'Ping succeeded' };
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
  identityId: string,
): Promise<{ success: boolean; error: interfaces.IErrorResponse | interfaces.INil; data: any }> => {
  // validate incoming message
  const payload: interfaces.IIndicativeEnrichmentPayload = {
    id: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<interfaces.IIndicativeEnrichmentPayload>('indicativeEnrichment');
  if (!validate(payload)) throw `Malformed message=${message}`;
  //create helper
  const soap = new SoapAid(fastXml.parse, tu.formatIndicativeEnrichment, tu.createIndicativeEnrichment);
  try {
    const resp = await soap.parseAndSendPayload<interfaces.IIndicativeEnrichmentResponse>(
      accountCode,
      username,
      agent,
      auth,
      payload,
      'IndicativeEnrichment',
      parserOptions,
    );

    const data = returnNestedObject<interfaces.IIndicativeEnrichmentResult>(resp, 'IndicativeEnrichmentResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;
    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    console.log('error ===> ', err);
    return { success: false, error: err, data: null };
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
  identityId: string,
): Promise<{ success: boolean; error: interfaces.IErrorResponse | interfaces.INil; data: any }> => {
  const payload: interfaces.IGetAuthenticationQuestionsPayload = {
    id: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<interfaces.IGetAuthenticationQuestionsPayload>('getAuthenticationQuestionsRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;
  //create helper classes
  const soap = new SoapAid(fastXml.parse, tu.formatGetAuthenticationQuestions, tu.createGetAuthenticationQuestions);

  try {
    const resp = await soap.parseAndSendPayload<interfaces.IGetAuthenticationQuestionsResponse>(
      accountCode,
      username,
      agent,
      auth,
      payload,
      'GetAuthenticationQuestions',
      parserOptions,
    );

    const data = returnNestedObject<interfaces.IGetAuthenticationQuestionsResult>(
      resp,
      'GetAuthenticationQuestionsResult',
    );
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;
    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    console.log('error ===> ', err);
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
  identityId: string,
): Promise<{ success: boolean; error: interfaces.IErrorResponse | interfaces.INil; data: any }> => {
  const payload: interfaces.IVerifyAuthenticationQuestionsPayload = {
    id: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<interfaces.IVerifyAuthenticationQuestionsPayload>(
    'verifyAuthenticationQuestionsRequest',
  );
  if (!validate(payload)) throw `Malformed message=${message}`;
  //create helper classes
  const soap = new SoapAid(
    fastXml.parse,
    tu.formatVerifyAuthenticationQuestions,
    tu.createVerifyAuthenticationQuestions,
  );

  try {
    const resp = await soap.parseAndSendPayload<interfaces.IVerifyAuthenticationQuestionsResponse>(
      accountCode,
      username,
      agent,
      auth,
      payload,
      'VerifyAuthenticationQuestions',
      parserOptions,
    );

    const data = returnNestedObject<interfaces.IVerifyAuthenticationQuestionsResult>(
      resp,
      'VerifyAuthenticationQuestionsResult',
    );
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;
    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    console.log('error ===> ', err);
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
  identityId: string,
  dispute: boolean = false,
): Promise<{
  success: boolean;
  error?: interfaces.IErrorResponse | interfaces.INil | string;
  data?: interfaces.IEnrollResult;
}> => {
  // validate incoming message
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;

  //create helper classes
  const soap = new SoapAid(tu.parseEnroll, tu.formatEnroll, tu.createEnroll, tu.createEnrollPayload);
  const sync = new Sync(tu.enrichEnrollmentData);

  try {
    const prepped = await qrys.getDataForEnrollment(payload);
    console.log('prepped ===> ', prepped.data);
    const resp = await soap.parseAndSendPayload<interfaces.IEnrollResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepped.data,
      'Enroll',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<interfaces.IEnrollResult>(resp, 'EnrollResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

    let response;
    if (responseType.toLowerCase() === 'success') {
      const synced = await sync.syncData({ id: payload.id }, data, dispute);
      response = synced
        ? { success: true, error: null, data: data }
        : { success: false, error: 'failed to sync data to db' };
    } else {
      response =
        error.Code === '103045'
          ? { success: true, error: null, data: null }
          : { success: false, error: error, data: null };
    }
    console.log('response ===> ', response);
    return response;
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
  identityId: string,
  dispute: boolean = false,
): Promise<{
  success: boolean;
  error?: interfaces.IErrorResponse | interfaces.INil | string;
  data?: interfaces.IEnrollResult;
}> => {
  // validate incoming message
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;

  //create helper classes
  const soap = new SoapAid(
    tu.parseEnrollDisputes,
    tu.formatEnrollDisputes,
    tu.createEnrollDisputes,
    tu.createEnrollDisputesPayload,
  );
  const sync = new Sync(tu.enrichEnrollDisputesData);

  try {
    const prepped = await qrys.getDataForEnrollment(payload);
    const resp = await soap.parseAndSendPayload<interfaces.IEnrollResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepped.data,
      'Enroll',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<interfaces.IEnrollResult>(resp, 'EnrollResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

    let response;
    if (responseType.toLowerCase() === 'success') {
      const synced = await sync.syncData({ id: payload.id }, data, dispute);
      response = synced
        ? { success: true, error: null, data: data }
        : { success: false, error: 'failed to sync data to db' };
    } else {
      response =
        error.Code === '103045'
          ? { success: true, error: null, data: null }
          : { success: false, error: error, data: null };
    }
    console.log('response ===> ', response);
    return response;
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
  identityId: string,
  dispute: boolean = false,
): Promise<{
  success: boolean;
  error?: interfaces.IErrorResponse | interfaces.INil | string;
  data?: interfaces.IFulfillResult;
}> => {
  // validate incoming message
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;

  //create helper classes
  const soap = new SoapAid(tu.parseFulfill, tu.formatFulfill, tu.createFulfill, tu.createFulfillPayload);
  const sync = new Sync(tu.enrichFulfillData);

  try {
    // get / parse data needed to process request
    const prepped = await qrys.getDataForFulfill(payload);
    const resp = await soap.parseAndSendPayload<interfaces.IFulfillResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepped.data,
      'Fulfill',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<interfaces.IFulfillResult>(resp, 'FulfillResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

    let response;
    if (responseType.toLowerCase() === 'success') {
      const synced = await sync.syncData({ id: payload.id }, data, dispute);
      response = synced
        ? { success: true, error: null, data: data }
        : { success: false, error: 'failed to sync data to db' };
    } else {
      response = { success: false, error: error };
    }
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    console.log('error ===> ', err);
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
  identityId: string,
  dispute: boolean = false,
): Promise<{
  success: boolean;
  error?: interfaces.IErrorResponse | interfaces.INil | string;
  data?: interfaces.IFulfillResult;
}> => {
  // validate incoming message
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;

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
    const prepped = await qrys.getDataForFulfill(payload);
    const resp = await soap.parseAndSendPayload<interfaces.IFulfillResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepped.data,
      'Fulfill',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<interfaces.IFulfillResult>(resp, 'FulfillResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

    let response;
    if (responseType.toLowerCase() === 'success') {
      const synced = await sync.syncData({ id: payload.id }, data, dispute);
      response = synced
        ? { success: true, error: null, data: data }
        : { success: false, error: 'failed to sync data to db' };
    } else {
      response = { success: false, error: error };
    }
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    console.log('error ===> ', err);
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
  identityId: string,
): Promise<{ success: boolean; error: interfaces.IErrorResponse | interfaces.INil; data: any }> => {
  // validate incoming message
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;
  const soap = new SoapAid(fastXml.parse, tu.formatGetServiceProduct, tu.createGetServiceProduct);

  try {
    // create helper classes
    const resp = await soap.parseAndSendPayload<interfaces.IGetServiceProductResponse>(
      accountCode,
      username,
      agent,
      auth,
      payload,
      'GetServiceProduct',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<interfaces.IGetServiceProductResult>(resp, 'GetServiceProductResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };
    console.log('response ===> ', response);
  } catch (err) {
    console.log('error ===> ', err);
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
  identityId: string,
): Promise<{
  success: boolean;
  error?: interfaces.IErrorResponse | interfaces.INil;
  data?: interfaces.IGetDisputeStatusResult | null;
}> => {
  // validate incoming message
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed payload=${payload}`;

  //create helper classes
  const soap = new SoapAid(
    tu.parseGetDisputeStatus,
    tu.formatGetDisputeStatus,
    tu.createGetDisputeStatus,
    tu.createGetDisputeStatusPayload,
  );

  try {
    // get / parse data needed to process request
    const prepped = await qrys.getDataForGetDisputeStatus(payload);
    const resp = await soap.parseAndSendPayload<interfaces.IGetDisputeStatusResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepped.data,
      'GetDisputeStatus',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<interfaces.IGetDisputeStatusResult>(resp, 'GetDisputeStatusResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    console.log('error ===> ', err);
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
export const GetDisputeStatusByID = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
  identityId: string,
): Promise<{
  success: boolean;
  error?: interfaces.IErrorResponse | interfaces.INil;
  data?: interfaces.IGetDisputeStatusResult | null;
}> => {
  // validate incoming message
  const payload: interfaces.IGetDisputeStatusByIdPayload = {
    id: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<interfaces.IGetDisputeStatusByIdPayload>('getDisputeStatusById');
  if (!validate(payload)) throw `Malformed payload=${payload}`;

  //create helper classes
  const soap = new SoapAid(
    tu.parseGetDisputeStatus,
    tu.formatGetDisputeStatus,
    tu.createGetDisputeStatus,
    tu.createGetDisputeStatusPayload,
  );

  try {
    // get / parse data needed to process request
    const prepped = await qrys.getDataForGetDisputeStatus(payload);
    const resp = await soap.parseAndSendPayload<interfaces.IGetDisputeStatusResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepped.data,
      'GetDisputeStatus',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<interfaces.IGetDisputeStatusResult>(resp, 'GetDisputeStatusResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    console.log('error ===> ', err);
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
  identityId: string,
): Promise<{ success: boolean; error?: any }> => {
  const live = GO_LIVE; // !!! IMPORTANT FLAG TO DISABLE MOCKS !!!
  const payload: interfaces.IStartDisputePayload = {
    id: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<interfaces.IStartDisputeRequest>('startDisputeRequest');
  const tradeline = ajv.getSchema<interfaces.IProcessDisputeTradelineResult>('disputeTradeline');
  const publicitem = ajv.getSchema<interfaces.IProcessDisputePublicResult>('disputePublicitem');
  const personalitem = ajv.getSchema<interfaces.IProcessDisputePersonalResult>('disputePersonalitem');

  console.log('variables ===> ', payload, JSON.stringify(payload.disputes[0]));
  if (!validate(payload)) throw `Malformed message=${message}`;
  let payloadMethod: (data: any, params?: any) => any;
  if (tradeline(payload.disputes[0])) {
    console.log('setting payloadmethod to tradeline');
    payloadMethod = tu.createStartDisputeTradelinePayload;
  }
  if (publicitem(payload.disputes[0])) {
    console.log('setting payloadmethod to public');
    payloadMethod = tu.createStartDisputePublicPayload;
  }
  if (personalitem(payload.disputes[0])) {
    console.log('setting payloadmethod to personal');
    payloadMethod = tu.createStartDisputePersonalPayload;
  }
  //create helper classes
  const sync = new Sync(tu.enrichDisputeData);
  const soap = new SoapAid(tu.parseStartDispute, tu.formatStartDispute, tu.createStartDispute, payloadMethod);
  try {
    console.log('*** IN START DISPUTE ***');
    const prepped = await qrys.getDataForStartDispute(payload);
    const reprepped = { data: prepped.data, disputes: payload.disputes };
    let resp = live
      ? await soap.parseAndSendPayload<interfaces.IStartDisputeResponse>(
          accountCode,
          username,
          agent,
          auth,
          reprepped,
          'StartDispute',
          parserOptions,
        )
      : await soap.parseAndDontSendPayload<interfaces.IStartDisputeResponse>(
          accountCode,
          username,
          agent,
          auth,
          reprepped,
          'StartDispute',
          parserOptions,
        );

    // get the specific response from parsed object
    if (!live) {
      resp = tu.parseStartDispute(START_DISPUTE_RESPONSE, parserOptions);
    }

    const data = returnNestedObject<interfaces.IStartDisputeResult>(resp, 'StartDisputeResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;
    const bundle: interfaces.IStartDisputeBundle = {
      startDisputeResult: data,
      disputes: payload.disputes,
    };

    console.log('start dispute response data ===> ', JSON.stringify(data));
    console.log('start dispute response type ===> ', JSON.stringify(responseType));
    console.log('start dispute response error ===> ', JSON.stringify(error));

    let response;
    if (responseType.toLowerCase() === 'success') {
      const synced = await sync.syncData({ id: payload.id }, bundle);
      response = synced ? { success: true, error: null } : { success: false, error: 'failed to sync data to db' };
    } else {
      response = { success: false, error: error };
    }
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    console.log('error ===> ', err);
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
  identityId: string,
): Promise<{ success: boolean; error: interfaces.IErrorResponse | interfaces.INil; data: any }> => {
  // validate incoming message
  const payload: interfaces.IGenericRequest = {
    id: identityId,
  };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;

  //create helper classes
  const soap = new SoapAid(
    fastXml.parse,
    tu.formatGetDisputeHistory,
    tu.createGetDisputeHistory,
    tu.createGetDisputeHistoryPayload,
  );

  try {
    // get / parse data needed to process request
    const prepped = await qrys.getDataForGetDisputeHistory(payload); // same data
    const resp = await soap.parseAndSendPayload<interfaces.IGetDisputeHistoryResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepped.data,
      'GetDisputeHistory',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<interfaces.IGetDisputeHistoryResult>(resp, 'GetDisputeHistoryResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    console.log('error ===> ', err);
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
  identityId: string,
): Promise<{ success: boolean; error?: any; data?: any }> => {
  const live = GO_LIVE; // !!! IMPORTANT FLAG TO DISABLE MOCKS !!!
  // validate incoming message
  const payload: interfaces.IGetInvestigationResultsRequest = {
    id: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<interfaces.IGetInvestigationResultsRequest>('getInvestigationResultsRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;

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
    const prepped = await qrys.getDataForGetInvestigationResults(payload); // same data
    const reprepped = { data: prepped.data, params: payload.disputeId };
    let resp = live
      ? await soap.parseAndSendPayload<interfaces.IGetInvestigationResultsResponse>(
          accountCode,
          username,
          agent,
          auth,
          reprepped,
          'GetInvestigationResults',
          parserOptions,
        )
      : await soap.parseAndDontSendPayload<interfaces.IGetInvestigationResultsResponse>(
          accountCode,
          username,
          agent,
          auth,
          reprepped,
          'GetInvestigationResults',
          parserOptions,
        );

    if (!live) {
      resp = await soap.processMockRequest<interfaces.IGetInvestigationResultsResponse>(
        GET_INVESTIGATION_RESULTS_RESPONSE,
        parserOptions,
      );
    }

    // get the specific response from parsed object
    const data = resp.Envelope.Body.GetInvestigationResultsResponse.GetInvestigationResultsResult;
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;
    const bundle: interfaces.IGetInvestigationEnrichPayload = {
      disputeId: payload.disputeId,
      getInvestigationResult: data,
    };

    let response;
    if (responseType.toLowerCase() === 'success') {
      const synced = await sync.syncData({ id: payload.id }, bundle);
      response = synced ? { success: true, error: null } : { success: false, error: 'failed to sync data to db' };
    } else {
      response = { success: false, error: error };
    }
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    console.log('error ===> ', err);
    return { success: false, error: err, data: null };
  }
};

export const CompleteOnboardingEnrollments = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
  identityId: string,
): Promise<{ success: Boolean; error?: any; data?: interfaces.IEnrollResult }> => {
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;

  try {
    const {
      success: enrollSuccess,
      error: enrollError,
      data: enrollData,
    } = await Enroll(accountCode, username, message, agent, auth, identityId, false); // report & score enroll
    console.log('enrollment results:success ====> ', enrollSuccess);
    console.log('enrollment results:error ====> ', enrollError);
    console.log('enrollment results:enrollData ====> ', enrollData);
    const response = enrollSuccess
      ? { success: true, error: null, data: enrollData }
      : { success: false, error: enrollError };
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    console.log('error ===> ', err);
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
  identityId: string,
): Promise<{ success: boolean; error?: any }> => {
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;

  let enrolled: boolean;
  try {
    console.log('*** IN GET ENROLL STATUS ***');
    const { data } = await qrys.getDisputeEnrollment(payload);
    enrolled = !data ? false : returnNestedObject<boolean>(data, 'disputeEnrolled');
    console.log('DisputePreflightCheck:enrolled ===> ', enrolled);
  } catch (err) {
    return { success: false, error: err };
  }

  if (!enrolled) {
    console.log('*** IN ENROLL ***');
    try {
      const { success, error, data } = await EnrollDisputes(accountCode, username, message, agent, auth, identityId);
      if (!success) return { success: false, error: error };
    } catch (err) {
      return { success: false, error: err };
    }
  }

  let refresh: boolean;
  try {
    console.log('*** IN REFRESH ***');
    const { data } = await qrys.getFulfilledOn(payload);
    const fulfilledOn = !data ? false : returnNestedObject<string>(data, 'fulfilledOn');
    console.log('DisputePreflightCheck:fulfilledOn ===> ', fulfilledOn);
    if (!fulfilledOn) {
      refresh = true;
    } else {
      const now = new Date();
      const last = new Date(fulfilledOn);
      refresh = dateDiffInHours(last, now) > 24 ? true : false;
    }
    console.log('DisputePreflightCheck:refresh ===> ', refresh);
  } catch (err) {
    return { success: false, error: err };
  }

  if (refresh) {
    console.log('*** IN REFRESH:FULFILL ***');
    try {
      const { success, error } = await FulfillDisputes(accountCode, username, message, agent, auth, identityId);
      if (!success) return { success: false, error: error };
    } catch (err) {
      return { success: false, error: err };
    }
  }

  try {
    console.log('*** IN GETDISPUTESTATUS ***');
    const { success, error } = await GetDisputeStatus(accountCode, username, message, agent, auth, identityId);
    const response = success ? { success: true } : { success: false, error: error };
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    console.log('error ===> ', err);
    return { success: false, error: err };
  }
};

/**
 * This performs the inflight check nightly and returns disputes that have been updated
 */
export const DisputeInflightCheck = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
  identityId: string,
): Promise<{ success: boolean; error?: any; data?: any }> => {
  // no payload is needed
  // call GetAlertsNotificationsForAlLUsers
  //  returns all incremental changes since last call
  // loop through and call GetDisputeStatus
  //   if status complete, then call GetInvestigationResults
  //    - send notification to the user that their disputes are ready
  // other wise it is cancelled and send notification that the dispute was calncelled
  const live = GO_LIVE;

  // const sync = new Sync(() => { });// need to create the enricher
  const soap = new SoapAid(
    tu.parseGetAlertNotifications,
    tu.formatGetAlertsNotifications,
    tu.createGetAlertsNotification,
    tu.createGetAlerNotificationsPaylod,
  );

  // call GetAlertsNotificationsForAllUsers
  let notifications: interfaces.IAlertNotification[] = [];
  try {
    console.log('*** IN GET ALERT NOTIFICATIONS ***');
    let resp: interfaces.IGetAlertNotificationsResponse = live
      ? await soap.parseAndSendPayload<interfaces.IGetAlertNotificationsResponse>(
          accountCode,
          username,
          agent,
          auth,
          {},
          'GetAlertNotificationsForAllUsers',
          parserOptions,
        )
      : await soap.parseAndDontSendPayload<interfaces.IGetAlertNotificationsResponse>(
          accountCode,
          username,
          agent,
          auth,
          {},
          'GetAlertNotificationsForAllUsers',
          parserOptions,
        );

    if (!live) {
      resp = GET_ALERT_NOTIFICATIONS_RESPONSE; // already parsed
    }
    console.log('get alerts resp ===> ', JSON.stringify(resp));
    const data = returnNestedObject<interfaces.IGetAlertNotificationsForAllUsersResult>(
      resp,
      'GetAlertNotificationsForAllUsersResult',
    );
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;
    if (responseType.toLowerCase() !== 'success') {
      throw error;
    }
    notifications = data?.AlertNotifications?.AlertNotification;
  } catch (err) {
    return { success: false, error: err };
  }

  // loop through and check the status of each result
  let allDisputeStatusUpdates: {
    success: boolean;
    error?: interfaces.IErrorResponse | interfaces.INil;
    data?: interfaces.IGetDisputeStatusResult | null;
  }[];
  if (notifications?.length) {
    try {
      console.log('*** IN GET DISPUTE STATUS ***');
      // alerts come with client keys which are also our keys
      allDisputeStatusUpdates = await Promise.all(
        notifications.map(async (alert) => {
          const message = JSON.stringify({ disputeId: `${alert.AlertId}` });
          return await GetDisputeStatusByID(accountCode, username, message, agent, auth, alert.ClientKey);
        }),
      );
      console.log('all status ===> ', JSON.stringify(allDisputeStatusUpdates));
    } catch (err) {
      return { success: false, error: err };
    }
  }

  // // loop through and update the status of each result
  // if (notifications?.length) {
  //   try {
  //     console.log('*** IN GET DISPUTE STATUS ***');
  //     // alerts come with client keys which are also our keys
  //     allDisputeStatusUpdates = await Promise.all(
  //       notifications.map(async (alert) => {
  //         return await GetDisputeStatus(accountCode, username, '', agent, auth, alert.ClientKey);
  //       }),
  //     );
  //     console.log('all status ===> ', JSON.stringify(allDisputeStatusUpdates));
  //   } catch (err) {
  //     return { success: false, error: err };
  //   }
  // }
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
export const GetTrendingData = async (
  accountCode: string,
  username: string,
  message: string,
  agent: https.Agent,
  auth: string,
  identityId: string,
): Promise<{ success: boolean; error: interfaces.IErrorResponse | interfaces.INil; data: any }> => {
  // validate incoming message
  let request: interfaces.IGetTrendingDataRequest = {
    ...JSON.parse(message),
  };
  const payload: interfaces.IGetTrendingDataRequest = {
    id: identityId,
    params: {
      ...request.params,
    },
  };
  const validate = ajv.getSchema<interfaces.IGetTrendingDataRequest>('getTrendingDataRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;

  //create helper classes
  const soap = new SoapAid(
    fastXml.parse,
    tu.formatGetTrendingData,
    tu.createGetTrendingData,
    tu.createGetTrendingDataPayload,
  );

  try {
    const resp = await soap.parseAndSendPayload<interfaces.IGetTrendingDataResponse>(
      accountCode,
      username,
      agent,
      auth,
      payload,
      'GetTrendingData',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = returnNestedObject<interfaces.IGetTrendingDataResult>(resp, 'GetTrendingDataResult');
    const responseType = data.ResponseType;
    const error = data.ErrorResponse;

    return responseType.toLowerCase() === 'success'
      ? { success: true, error: error, data: data }
      : { success: false, error: error, data: null };
  } catch (err) {
    return { success: false, error: err, data: null };
  }
};
