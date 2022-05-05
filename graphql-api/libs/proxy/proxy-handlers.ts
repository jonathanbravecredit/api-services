import * as he from 'he';
import * as https from 'https';
import * as fastXml from 'fast-xml-parser';
import * as qrys from 'libs/proxy/proxy-queries';
import * as interfaces from 'libs/interfaces';
import * as tu from 'libs/transunion';
import * as dayjs from 'dayjs';
import { ajv } from 'libs/schema/validation';
import { Sync } from 'libs/utils/sync/sync';
import { SoapAid } from 'libs/utils/soap-aid/soap-aid';
import { dateDiffInHours } from 'libs/utils/dates/dates';
import { returnNestedObject } from 'libs/utils/helpers/helpers';
import { START_DISPUTE_RESPONSE } from 'libs/examples/mocks/StartDisputeResponse';
import { GET_ALERT_NOTIFICATIONS_RESPONSE } from 'libs/examples/mocks/GetAlertNotificationsResponse';
import { ALL_GET_INVESTIGATION_MOCKS } from 'libs/examples/mocks/AllGetInvestigationMocks';
import { GET_DISPUTE_STATUS_RESPONSE_WITHID } from 'libs/examples/mocks/GetDisputeStatusResponse-Complete';
import { DB } from 'libs/utils/db/db';
import { Dispute } from 'libs/utils/db/disputes/model/dispute.model';
import { updateInvestigationResultsDB, writeEnrollReport } from 'libs/transunion';
import ErrorLogger from 'libs/utils/db/logger/logger-errors';
import TransactionLogger from 'libs/utils/db/logger/logger-transactions';
import { CreditScoreTracking } from 'libs/utils/db/credit-score-tracking/model/credit-score-tracking';
import { updateEnrollmentStatus, updateNavBarBadges } from 'libs/utils/db/dynamo-db/dynamo';
import { ICancelEnrollGraphQLResponse } from 'libs/interfaces';
import { FulfillV2 } from 'libs/transunion/fulfill/_dnu/Fulfillv2';
import { FulfillDisputesV2 } from 'libs/transunion/fulfill-disputes/FulfillDisputesV2';
import { MergeReport } from 'libs/models/MergeReport/MergeReport';
import {
  IIndicativeEnrichmentPayload,
  IIndicativeEnrichmentResponse,
} from 'libs/transunion/indicative-enrichment/indicative-enrichment.interface';

const GO_LIVE = true;
const errorLogger = new ErrorLogger();
const transactionLogger = new TransactionLogger();
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
export const Ping = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error?: interfaces.IErrorResponse | interfaces.INil | string;
  data?: any;
}> => {
  const soap = new SoapAid(fastXml.parse, () => {}, tu.createPing);
  try {
    const { xml } = soap.createPackage(null, null, null);
    const request = soap.createRequestPayload(agent, auth, xml, 'Ping');
    if (!xml || !request) throw new Error(`Missing xml:${xml}, or request:${request}`);
    await soap.processRequest(request, parserOptions);
    const response = { success: true, error: null, data: 'Ping succeeded' };
    const l1 = transactionLogger.createTransaction(identityId, 'Ping', JSON.stringify(response));
    await transactionLogger.logger.create(l1);
    return response;
  } catch (err) {
    const error = errorLogger.createError(identityId, 'Ping', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err };
  }
};

/**
 * Simple method to ping TU services and ensure a successful response
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const UpdateNavBar = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error?: interfaces.IErrorResponse | interfaces.INil | string;
  data?: any;
}> => {
  const payload: interfaces.INavBarRequest = {
    id: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<interfaces.INavBarRequest>('navBarRequest');
  if (!validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;

  try {
    await updateNavBarBadges(payload);
    return { success: true, error: null, data: null };
  } catch (err) {
    const error = errorLogger.createError(identityId, 'UpdateNavBar', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err };
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
export const GetAuthenticationQuestions = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error: interfaces.IErrorResponse | interfaces.INil;
  data: any;
}> => {
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

    const data = resp.Envelope?.Body?.GetAuthenticationQuestionsResponse?.GetAuthenticationQuestionsResult;
    const responseType = data?.ResponseType;
    const error = data?.ErrorResponse;

    // log tu responses
    const l1 = transactionLogger.createTransaction(identityId, 'GetAuthenticationQuestions:data', JSON.stringify(data));
    const l2 = transactionLogger.createTransaction(
      identityId,
      'GetAuthenticationQuestions:type',
      JSON.stringify(responseType),
    );
    const l3 = transactionLogger.createTransaction(
      identityId,
      'GetAuthenticationQuestions:error',
      JSON.stringify(error),
    );
    await transactionLogger.logger.create(l1);
    await transactionLogger.logger.create(l2);
    await transactionLogger.logger.create(l3);

    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };

    // log success response
    const l4 = transactionLogger.createTransaction(
      identityId,
      'GetAuthenticationQuestions:response',
      JSON.stringify(response),
    );
    await transactionLogger.logger.create(l4);

    return response;
  } catch (err) {
    const error = errorLogger.createError(identityId, 'GetAuthenticationQuestions', JSON.stringify(err));
    await errorLogger.logger.create(error);
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
export const VerifyAuthenticationQuestions = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error: interfaces.IErrorResponse | interfaces.INil;
  data: any;
}> => {
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

    const data = resp.Envelope?.Body?.VerifyAuthenticationQuestionsResponse?.VerifyAuthenticationQuestionsResult;
    const responseType = data?.ResponseType;
    const error = data?.ErrorResponse;

    // log tu responses
    const l1 = transactionLogger.createTransaction(
      identityId,
      'VerifyAuthenticationQuestions:data',
      JSON.stringify(data),
    );
    const l2 = transactionLogger.createTransaction(
      identityId,
      'VerifyAuthenticationQuestions:type',
      JSON.stringify(responseType),
    );
    const l3 = transactionLogger.createTransaction(
      identityId,
      'VerifyAuthenticationQuestions:error',
      JSON.stringify(error),
    );
    await transactionLogger.logger.create(l1);
    await transactionLogger.logger.create(l2);
    await transactionLogger.logger.create(l3);

    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };

    // log success response
    const l4 = transactionLogger.createTransaction(
      identityId,
      'VerifyAuthenticationQuestions:response',
      JSON.stringify(response),
    );
    await transactionLogger.logger.create(l4);

    return response;
  } catch (err) {
    // log error response
    const error = errorLogger.createError(identityId, 'VerifyAuthenticationQuestions', JSON.stringify(err));
    await errorLogger.logger.create(error);
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
  {
    accountCode,
    username,
    message,
    agent,
    auth,
    identityId,
  }: {
    accountCode: string;
    username: string;
    message: string;
    agent: https.Agent;
    auth: string;
    identityId: string;
  },
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
    const data = resp.Envelope?.Body?.EnrollResponse?.EnrollResult;
    const responseType = data?.ResponseType;
    const error = data?.ErrorResponse;

    // log tu responses
    const l1 = transactionLogger.createTransaction(identityId, 'Enroll:data', JSON.stringify(data));
    const l2 = transactionLogger.createTransaction(identityId, 'Enroll:type', JSON.stringify(responseType));
    const l3 = transactionLogger.createTransaction(identityId, 'Enroll:error', JSON.stringify(error));
    await transactionLogger.logger.create(l1);
    await transactionLogger.logger.create(l2);
    await transactionLogger.logger.create(l3);

    let response;
    if (responseType.toLowerCase() === 'success') {
      await writeEnrollReport(data, identityId);
      const synced = await sync.syncData({ id: payload.id }, data, dispute);
      response = synced
        ? { success: true, error: null, data: data }
        : { success: false, error: 'failed to sync data to db' };
    } else {
      response =
        `${error.Code}` == '103045'
          ? { success: true, error: null, data: null }
          : { success: false, error: error, data: null };
    }

    // log success response
    const l4 = transactionLogger.createTransaction(identityId, 'Enroll:response', JSON.stringify(response));
    await transactionLogger.logger.create(l4);

    return response;
  } catch (err) {
    // log error response
    const error = errorLogger.createError(identityId, 'Enroll', JSON.stringify(err));
    await errorLogger.logger.create(error);
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
  {
    accountCode,
    username,
    message,
    agent,
    auth,
    identityId,
  }: {
    accountCode: string;
    username: string;
    message: string;
    agent: https.Agent;
    auth: string;
    identityId: string;
  },
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
    const data = resp.Envelope?.Body?.EnrollResponse?.EnrollResult;
    const responseType = data?.ResponseType;
    const error = data?.ErrorResponse;

    // log tu responses
    const l1 = transactionLogger.createTransaction(identityId, 'EnrollDisputes:data', JSON.stringify(data));
    const l2 = transactionLogger.createTransaction(identityId, 'EnrollDisputes:type', JSON.stringify(responseType));
    const l3 = transactionLogger.createTransaction(identityId, 'EnrollDisputes:error', JSON.stringify(error));
    await transactionLogger.logger.create(l1);
    await transactionLogger.logger.create(l2);
    await transactionLogger.logger.create(l3);

    let response;
    if (responseType.toLowerCase() === 'success') {
      const synced = await sync.syncData({ id: payload.id }, data, dispute);
      response = synced
        ? { success: true, error: null, data: data }
        : { success: false, error: 'failed to sync data to db' };
    } else {
      response =
        `${error.Code}` == '103045'
          ? { success: true, error: null, data: null }
          : { success: false, error: error, data: null };
    }

    // log success response
    const l4 = transactionLogger.createTransaction(identityId, 'EnrollDisputes:response', JSON.stringify(response));
    await transactionLogger.logger.create(l4);

    return response;
  } catch (err) {
    // log error response
    const error = errorLogger.createError(identityId, 'EnrollDisputes', JSON.stringify(err));
    await errorLogger.logger.create(error);
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
export const CancelEnroll = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error?: interfaces.IErrorResponse | interfaces.INil | string;
  data?: string;
}> => {
  // validate incoming message
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${payload}`;

  try {
    const prepped: { data: ICancelEnrollGraphQLResponse } = await qrys.getCancelEnrollment(payload);
    const enrollmentKey = prepped.data.data.getAppData?.agencies?.transunion?.enrollmentKey;
    const disputeKey = prepped.data.data.getAppData?.agencies?.transunion?.disputeEnrollmentKey;
    if (!enrollmentKey && !disputeKey)
      throw `no enrollment keys, enrollmentKey=${enrollmentKey}, disputeEnrollmentKey=${disputeKey}`;
    if (enrollmentKey) {
      await CancelEnrollWorker({ accountCode, username, message, agent, auth, identityId }, prepped, enrollmentKey);
    }
    if (disputeKey) {
      await CancelEnrollWorker({ accountCode, username, message, agent, auth, identityId }, prepped, disputeKey);
    }
    return { success: true, error: null, data: 'success' };
  } catch (err) {
    // log error response
    const error = errorLogger.createError(identityId, 'CancelEnroll', JSON.stringify(err));
    await errorLogger.logger.create(error);
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
export const CancelEnrollWorker = async (
  {
    accountCode,
    username,
    message,
    agent,
    auth,
    identityId,
  }: {
    accountCode: string;
    username: string;
    message: string;
    agent: https.Agent;
    auth: string;
    identityId: string;
  },
  prepped: { data: ICancelEnrollGraphQLResponse },
  enrollmentKey: string,
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
    fastXml.parse,
    tu.formatCancelEnroll,
    tu.createCancelEnroll,
    tu.createCancelEnrollmentPayload,
  );

  try {
    if (!enrollmentKey) throw `no enrollment keys, enrollmentKey=${enrollmentKey}`;
    const packet: ICancelEnrollGraphQLResponse = {
      data: {
        getAppData: {
          id: prepped.data.data.getAppData.id,
          agencies: {
            transunion: {
              enrollmentKey: enrollmentKey,
            },
          },
        },
      },
    };
    const resp = await soap.parseAndSendPayload<interfaces.ICancelEnrollResponse>(
      accountCode,
      username,
      agent,
      auth,
      packet,
      'CancelEnrollment',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = resp.Envelope?.Body?.CancelEnrollmentResponse?.CancelEnrollmentResult;
    const responseType = data?.ResponseType;
    const success = data?.Success;
    const error = data?.ErrorResponse;

    // log tu responses
    const l1 = transactionLogger.createTransaction(identityId, 'CancelEnroll:data', JSON.stringify(data));
    const l2 = transactionLogger.createTransaction(identityId, 'CancelEnroll:type', JSON.stringify(responseType));
    const l3 = transactionLogger.createTransaction(identityId, 'CancelEnroll:error', JSON.stringify(error));
    await transactionLogger.logger.create(l1);
    await transactionLogger.logger.create(l2);
    await transactionLogger.logger.create(l3);

    let response;
    if (responseType.toLowerCase() === 'success' && success) {
      const synced = await updateEnrollmentStatus(
        payload.id,
        false,
        'cancelled',
        'Account cancelled due to inactivity or user request',
      );
      response = synced
        ? { success: true, error: null, data: 'success' }
        : { success: false, error: 'failed to sync data to db' };
    } else {
      response = { success: false, error: error };
    }
    return response;
  } catch (err) {
    // log error response
    const error = errorLogger.createError(identityId, 'CancelEnroll', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: null };
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
export const GetServiceProduct = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error: interfaces.IErrorResponse | interfaces.INil;
  data: any;
}> => {
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
    const data = resp.Envelope?.Body?.GetServiceProductResponse?.GetServiceProductResult;
    const responseType = data?.ResponseType;
    const error = data?.ErrorResponse;

    // log tu responses
    const l1 = transactionLogger.createTransaction(identityId, 'GetServiceProduct:data', JSON.stringify(data));
    const l2 = transactionLogger.createTransaction(identityId, 'GetServiceProduct:type', JSON.stringify(responseType));
    const l3 = transactionLogger.createTransaction(identityId, 'GetServiceProduct:error', JSON.stringify(error));
    await transactionLogger.logger.create(l1);
    await transactionLogger.logger.create(l2);
    await transactionLogger.logger.create(l3);

    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };

    // log success response
    const l4 = transactionLogger.createTransaction(identityId, 'GetServiceProduct:response', JSON.stringify(response));
    await transactionLogger.logger.create(l4);

    return response;
  } catch (err) {
    // log error response
    const error = errorLogger.createError(identityId, 'GetServiceProduct', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: null };
  }
};

/**
 * Confirms eligibility to open a dispute
 *  (Optional) ID can be passsed to check status of open dispute
 *  IMPORTANT - This is a non-syncing operation and only returns success or not
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Full message format (fullfillment key required)...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const GetDisputeStatus = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
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
    if (!prepped.data?.data?.getAppData?.id) {
      throw `No record in db:=${prepped}`;
    }
    const resp = await soap.parseAndSendPayload<interfaces.IGetDisputeStatusResponse>(
      accountCode,
      username,
      agent,
      auth,
      prepped,
      'GetDisputeStatus',
      parserOptions,
    );

    // get the specific response from parsed object
    const data = resp.Envelope?.Body?.GetDisputeStatusResponse?.GetDisputeStatusResult;
    const responseType = data?.ResponseType;
    const error = data?.ErrorResponse;

    // log tu responses
    const l1 = transactionLogger.createTransaction(identityId, 'GetDisputeStatus:data', JSON.stringify(data));
    const l2 = transactionLogger.createTransaction(identityId, 'GetDisputeStatus:type', JSON.stringify(responseType));
    const l3 = transactionLogger.createTransaction(identityId, 'GetDisputeStatus:error', JSON.stringify(error));
    await transactionLogger.logger.create(l1);
    await transactionLogger.logger.create(l2);
    await transactionLogger.logger.create(l3);

    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };

    // log success response
    const l4 = transactionLogger.createTransaction(identityId, 'GetDisputeStatus:response', JSON.stringify(response));
    await transactionLogger.logger.create(l4);

    return response;
  } catch (err) {
    // log error response
    const error = errorLogger.createError(identityId, 'GetDisputeStatus', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: null };
  }
};

/**
 * Confirms eligibility to open a dispute
 *  (Optional) ID can be passsed to check status of open dispute
 *  IMPORTANT - This is a sync operation and updates the disputes with the latest status
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Full message format (fullfillment key required)...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const ListDisputesByUser = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error?: interfaces.IErrorResponse | interfaces.INil;
  data?: Dispute[] | null;
}> => {
  const live = GO_LIVE; // !!! IMPORTANT FLAG TO DISABLE MOCKS !!!
  // validate incoming message
  const payload: interfaces.IGenericRequest = {
    id: identityId,
  };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed payload=${payload}`;

  try {
    // get / parse data needed to process request
    const results = await DB.disputes.list(payload.id);
    const response = { success: true, error: null, data: results };
    return response;
  } catch (err) {
    // log error response
    const error = errorLogger.createError(identityId, 'ListDisputesByUser', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: null };
  }
};

/**
 * Confirms eligibility to open a dispute
 *  (Optional) ID can be passsed to check status of open dispute
 *  IMPORTANT - This is a sync operation and updates the disputes with the latest status
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Full message format (fullfillment key required)...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const GetDisputeStatusByID = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error?: interfaces.IErrorResponse | interfaces.INil;
  data?: interfaces.IGetDisputeStatusResult | null;
}> => {
  const live = GO_LIVE; // !!! IMPORTANT FLAG TO DISABLE MOCKS !!!
  // validate incoming message
  const payload: interfaces.IGetDisputeStatusByIdPayload = {
    id: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<interfaces.IGetDisputeStatusByIdPayload>('getDisputeStatusById');
  if (!validate(payload)) throw `Malformed payload=${payload}`;

  //create helper classes
  // const sync = new Sync(tu.enrichUpdatedDisputeData);
  const soap = new SoapAid(
    tu.parseGetDisputeStatus,
    tu.formatGetDisputeStatus,
    tu.createGetDisputeStatus,
    tu.createGetDisputeStatusPayload,
  );

  try {
    // get / parse data needed to process request
    const prepped = await qrys.getDataForGetDisputeStatus(payload);
    if (!prepped.data?.data?.getAppData?.id) {
      throw `No record in db:=${prepped}`;
    }

    let resp: interfaces.IGetDisputeStatusResponse = live
      ? await soap.parseAndSendPayload<interfaces.IGetDisputeStatusResponse>(
          accountCode,
          username,
          agent,
          auth,
          { data: prepped.data, disputeId: payload.disputeId },
          'GetDisputeStatus',
          parserOptions,
        )
      : await soap.parseAndDontSendPayload<interfaces.IGetDisputeStatusResponse>(
          accountCode,
          username,
          agent,
          auth,
          { data: prepped.data, disputeId: payload.disputeId },
          'GetDisputeStatus',
          parserOptions,
        );

    if (!live) {
      resp = tu.parseGetDisputeStatus(GET_DISPUTE_STATUS_RESPONSE_WITHID, parserOptions);
    }
    // get the specific response from parsed object
    const data = resp.Envelope?.Body?.GetDisputeStatusResponse?.GetDisputeStatusResult;
    const responseType = data?.ResponseType;
    const error = data?.ErrorResponse;

    // log tu responses
    const l1 = transactionLogger.createTransaction(identityId, 'GetDisputeStatusByID:data', JSON.stringify(data));
    const l2 = transactionLogger.createTransaction(
      identityId,
      'GetDisputeStatusByID:type',
      JSON.stringify(responseType),
    );
    const l3 = transactionLogger.createTransaction(identityId, 'GetDisputeStatusByID:error', JSON.stringify(error));
    await transactionLogger.logger.create(l1);
    await transactionLogger.logger.create(l2);
    await transactionLogger.logger.create(l3);

    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };

    // log success response
    const l4 = transactionLogger.createTransaction(
      identityId,
      'GetDisputeStatusByID:response',
      JSON.stringify(response),
    );
    await transactionLogger.logger.create(l4);

    return response;
  } catch (err) {
    // log error response
    const error = errorLogger.createError(identityId, 'GetDisputeStatusByID', JSON.stringify(err));
    await errorLogger.logger.create(error);
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
export const StartDispute = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{ success: boolean; error?: any; data?: any }> => {
  const live = GO_LIVE; // !!! IMPORTANT FLAG TO DISABLE MOCKS !!!
  const payload: interfaces.IStartDisputePayload = {
    id: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<interfaces.IStartDisputeRequest>('startDisputeRequest');
  const tradeline = ajv.getSchema<interfaces.IProcessDisputeTradelineResult>('disputeTradeline');
  const publicitem = ajv.getSchema<interfaces.IProcessDisputePublicResult>('disputePublicitem');
  const personalitem = ajv.getSchema<interfaces.IProcessDisputePersonalResult>('disputePersonalitem');

  if (!validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;
  let payloadMethod: (data: any, params?: any) => any;
  let startDisputeMethod: (msg: interfaces.IStartDispute) => string;
  if (tradeline(payload.disputes[0])) {
    payloadMethod = tu.createStartDisputeTradelinePayload;
    startDisputeMethod = tu.createStartDispute;
  }
  if (publicitem(payload.disputes[0])) {
    payloadMethod = tu.createStartDisputePublicPayload;
    startDisputeMethod = tu.createStartDispute;
  }
  if (personalitem(payload.disputes[0])) {
    payloadMethod = tu.createStartDisputePersonalPayload;
    startDisputeMethod = tu.createStartDisputePersonal;
  }
  //create helper classes
  // const sync = new Sync(tu.enrichDisputeData);
  const soap = new SoapAid(tu.parseStartDispute, tu.formatStartDispute, startDisputeMethod, payloadMethod);
  try {
    console.log('*** IN START DISPUTE ***');
    const prepped = await qrys.getDataForStartDispute(payload);
    const reprepped = { data: prepped.data, disputes: payload.disputes };
    let resp: interfaces.IStartDisputeResponse = live
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

    const data = resp.Envelope?.Body?.StartDisputeResponse?.StartDisputeResult;
    const responseType = data?.ResponseType;
    const error = data?.ErrorResponse;
    const bundle: interfaces.IStartDisputeBundle = {
      startDisputeResult: data,
      disputes: payload.disputes,
    };

    const l1 = transactionLogger.createTransaction(identityId, 'StartDispute:data', JSON.stringify(data));
    const l2 = transactionLogger.createTransaction(identityId, 'StartDispute:type', JSON.stringify(responseType));
    const l3 = transactionLogger.createTransaction(identityId, 'StartDispute:error', JSON.stringify(error));
    await transactionLogger.logger.create(l1);
    await transactionLogger.logger.create(l2);
    await transactionLogger.logger.create(l3);

    let response;
    if (responseType.toLowerCase() === 'success') {
      // need to add to the app database, and to the disputes database
      let status = data?.DisputeStatus?.DisputeStatusDetail?.Status;
      let disputeId = data?.DisputeStatus?.DisputeStatusDetail?.DisputeId;
      let openedOn = new Date().toISOString();
      let closedOn =
        status.toLowerCase() === 'cancelleddispute' || status.toLowerCase() === 'completedispute' ? openedOn : null;
      const dbDispute = DB.disputes.generators.createDisputeDBRecord(
        identityId,
        data,
        JSON.stringify(payload.disputes),
        openedOn,
        closedOn,
      );

      const newDispute = await DB.disputes.create(dbDispute);
      if (status.toLowerCase() === 'completedispute') {
        // auto closed
        const payload = {
          accountCode,
          username,
          message: JSON.stringify({ disputeId: disputeId.toString() }),
          agent,
          auth,
          identityId,
        };
        console.log('CALLING FULFILL');
        const fulfilled = await new FulfillV2(payload).run();
        if (!fulfilled.success) throw `fulfilled failed; error: ${fulfilled.error}; data: ${fulfilled.data}`;
        await GetInvestigationResults(payload);
      }
      response = { success: true, error: null, data: newDispute };
    } else {
      response = { success: false, error: error };
    }
    // log success response
    const l4 = transactionLogger.createTransaction(identityId, 'StartDispute:response', JSON.stringify(response));
    await transactionLogger.logger.create(l4);
    return response;
  } catch (err) {
    // log error response
    const error = errorLogger.createError(identityId, 'StartDispute', JSON.stringify(err));
    await errorLogger.logger.create(error);
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
export const GetDisputeHistory = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error: interfaces.IErrorResponse | interfaces.INil;
  data: any;
}> => {
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
    const data = resp.Envelope?.Body?.GetDisputeHistoryResponse?.GetDisputeHistoryResult;
    const responseType = data?.ResponseType;
    const error = data?.ErrorResponse;

    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    const error = errorLogger.createError(identityId, 'GetDisputeHistory', JSON.stringify(err));
    await errorLogger.logger.create(error);
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
export const GetInvestigationResults = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{ success: boolean; error?: any; data?: any }> => {
  const live = GO_LIVE; // !!! IMPORTANT FLAG TO DISABLE MOCKS !!!
  // validate incoming message
  const payload: interfaces.IGetInvestigationResultsRequest = {
    id: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<interfaces.IGetInvestigationResultsRequest>('getInvestigationResultsRequest');
  if (!validate(payload)) throw `Malformed message in getInvestigationResults=${JSON.stringify(payload)}`;

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
      // 0 - dispute info updated
      // 1 - dispute info update andother info
      // 2 - info updated
      // 3 - verified and updated
      // 4 - verified as accuraed
      // 5 - verified as accurate and updated
      // 6 - deleted
      resp = tu.parseInvestigationResults(ALL_GET_INVESTIGATION_MOCKS[6], parserOptions);
      console.log('MOCK response data ==> ', JSON.stringify(resp));
    }

    // get the specific response from parsed object
    const data = resp.Envelope?.Body?.GetInvestigationResultsResponse?.GetInvestigationResultsResult;
    const responseType = data?.ResponseType;
    const error = data?.ErrorResponse;
    const bundle: interfaces.IGetInvestigationEnrichPayload = {
      disputeId: payload.disputeId,
      getInvestigationResult: data,
    };

    let response;
    if (responseType.toLowerCase() === 'success') {
      const synced = await updateInvestigationResultsDB(payload.id, bundle);
      response = synced ? { success: true, error: null } : { success: false, error: 'failed to sync data to db' };
    } else {
      response = { success: false, error: error };
    }
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    const error = errorLogger.createError(identityId, 'GetInvestigationResults', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: null };
  }
};

export const CompleteOnboardingEnrollments = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: Boolean;
  error?: any;
  data?: interfaces.IEnrollResult;
}> => {
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;

  try {
    const payload = {
      accountCode,
      username,
      message,
      agent,
      auth,
      identityId,
    };
    const { success: enrollSuccess, error: enrollError, data: enrollData } = await Enroll(payload, false); // report & score enroll
    const l1 = transactionLogger.createTransaction(
      identityId,
      'CompleteOnboardingEnrollments:success',
      JSON.stringify(enrollSuccess),
    );
    const l2 = transactionLogger.createTransaction(
      identityId,
      'CompleteOnboardingEnrollments:err',
      JSON.stringify(enrollError),
    );
    const l3 = transactionLogger.createTransaction(
      identityId,
      'CompleteOnboardingEnrollments:enrollData',
      JSON.stringify(enrollData),
    );
    await transactionLogger.logger.create(l1);
    await transactionLogger.logger.create(l2);
    await transactionLogger.logger.create(l3);
    const response = enrollSuccess
      ? { success: true, error: null, data: enrollData }
      : { success: false, error: enrollError };
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    const error = errorLogger.createError(identityId, 'CompleteOnboardingEnrollments', JSON.stringify(err));
    await errorLogger.logger.create(error);
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
export const DisputePreflightCheck = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{ success: boolean; error?: any; data: { report: MergeReport | null } }> => {
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${payload}`;

  let report: { report: MergeReport };

  let enrolled: boolean;
  try {
    console.log('*** IN GET ENROLL STATUS ***');
    const { data } = await qrys.getDisputeEnrollment(payload);
    enrolled = !data ? false : returnNestedObject<boolean>(data, 'disputeEnrolled');
    console.log('DisputePreflightCheck:enrolled ===> ', enrolled);
  } catch (err) {
    const error = errorLogger.createError(identityId, 'DisputePreflightCheck:EnrollStatus', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: null };
  }

  if (!enrolled) {
    console.log('*** IN ENROLL ***');
    try {
      const payload = {
        accountCode,
        username,
        message,
        agent,
        auth,
        identityId,
      };
      const { success, error, data } = await EnrollDisputes(payload);
      if (!success) return { success: false, error: error, data: { report: null } };
    } catch (err) {
      const error = errorLogger.createError(identityId, 'DisputePreflightCheck:EnrollDisputes', JSON.stringify(err));
      await errorLogger.logger.create(error);
      return { success: false, error: err, data: { report: null } };
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
      const now = dayjs(new Date());
      const last = dayjs(fulfilledOn);
      refresh = now.diff(last, 'hour') >= 24 ? true : false;
    }
    console.log('DisputePreflightCheck:refresh ===> ', refresh);
  } catch (err) {
    const error = errorLogger.createError(identityId, 'DisputePreflightCheck:Refresh', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: { report: null } };
  }

  if (refresh) {
    console.log('*** IN REFRESH:FULFILL ***');
    try {
      const payload = {
        accountCode,
        username,
        message,
        agent,
        auth,
        identityId,
      };
      const fulfill = new FulfillDisputesV2(payload);
      const { success, error, data } = await fulfill.run();
      console.log('refresh success: ', success);
      console.log('refresh error: ', error);
      console.log('refresh data: ', data);
      report = { report: fulfill.mergeReport };
      console.log('refresh report: ', report);
    } catch (err) {
      const error = errorLogger.createError(identityId, 'DisputePreflightCheck:FulfillDisputes', JSON.stringify(err));
      await errorLogger.logger.create(error);
      return { success: false, error: err, data: { report: null } };
    }
  }

  try {
    console.log('*** IN GETDISPUTESTATUS ***');
    const payload = {
      accountCode,
      username,
      message,
      agent,
      auth,
      identityId,
    };
    const { success, error } = await GetDisputeStatus(payload);
    const response = success
      ? { success: true, error: null, data: report }
      : { success: false, error: error, data: { report: null } };
    console.log('response ===> ', response);
    return response;
  } catch (err) {
    const error = errorLogger.createError(identityId, 'DisputePreflightCheck:GetDisputeStatus', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: { report: null } };
  }
};

/**
 * This performs the inflight check nightly and returns disputes that have been updated
 * -- DO NOT user identityId param as this is called by backend services and now ID is available
 */
export const DisputeInflightCheck = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{ success: boolean; error?: any; data?: any }> => {
  // no payload is needed
  // call GetAlertsNotificationsForAlLUsers
  //  returns all incremental changes since last call
  // loop through and call GetDisputeStatus
  //   if status complete, then call GetInvestigationResults
  //    - send notification to the user that their disputes are ready
  // other wise it is cancelled and send notification that the dispute was calncelled
  const live = GO_LIVE;

  // const sync = new Sync(tu.enrichUpdatedDisputeData);
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
          '',
          'GetAlertNotificationsForAllUsers',
          parserOptions,
        )
      : await soap.parseAndDontSendPayload<interfaces.IGetAlertNotificationsResponse>(
          accountCode,
          username,
          agent,
          auth,
          '',
          'GetAlertNotificationsForAllUsers',
          parserOptions,
        );

    if (!live) {
      resp = GET_ALERT_NOTIFICATIONS_RESPONSE; // already parsed
    }

    const data = resp.Envelope?.Body?.GetAlertNotificationsForAllUsersResponse?.GetAlertNotificationsForAllUsersResult;
    const responseType = data?.ResponseType;
    const error = data?.ErrorResponse;

    const l1 = transactionLogger.createTransaction(
      'alert_notification_operation',
      'GetAlertNotifications:data',
      JSON.stringify(data),
    );
    const l2 = transactionLogger.createTransaction(
      'alert_notification_operation',
      'GetAlertNotifications:response',
      JSON.stringify(responseType),
    );
    const l3 = transactionLogger.createTransaction(
      'alert_notification_operation',
      'GetAlertNotifications:error',
      JSON.stringify(error),
    );
    await transactionLogger.logger.create(l1);
    await transactionLogger.logger.create(l2);
    await transactionLogger.logger.create(l3);

    if (responseType.toLowerCase() !== 'success') {
      // does the TU api respond
      throw error;
    }
    notifications =
      data?.AlertNotifications?.AlertNotification instanceof Array
        ? data?.AlertNotifications?.AlertNotification
        : [data?.AlertNotifications?.AlertNotification];
    console.log('all notifications ===> ', JSON.stringify(notifications));
  } catch (err) {
    const error = errorLogger.createError(
      'alert_notification_operation',
      'DisputeInflightCheck:GetAlertNotifications',
      JSON.stringify(err),
    );
    await errorLogger.logger.create(error);
    return { success: false, error: err };
  }

  // loop through and check the status of each result
  let allDisputeStatusUpdates: {
    success: boolean;
    error?: interfaces.IErrorResponse | interfaces.INil;
    data?: interfaces.IGetDisputeStatusResult | null;
  }[] = [];
  if (notifications?.length) {
    try {
      console.log('*** IN GET DISPUTE STATUS ***');
      // alerts come with client keys (assigned by us) which are also our DB keys
      allDisputeStatusUpdates = await Promise.all(
        notifications.map(async (alert) => {
          const message = JSON.stringify({ disputeId: `${alert.AlertId}` });
          const payload = {
            accountCode,
            username,
            message,
            agent,
            auth,
            identityId: alert.ClientKey,
          };
          return await GetDisputeStatusByID(payload);
        }),
      );
      console.log('all status ===> ', JSON.stringify(allDisputeStatusUpdates));
    } catch (err) {
      const error = errorLogger.createError(
        'alert_notification_operation',
        'DisputeInflightCheck:GetDisputeStatus',
        JSON.stringify(err),
      );
      await errorLogger.logger.create(error);
      return { success: false, error: err };
    }
  }

  // for mock only, set the dispute status to 'completeDispute'
  // if (!live) {
  //   allDisputeStatusUpdates = allDisputeStatusUpdates.map((i) => {
  //     if (!i.data) return i;
  //     return {
  //       ...i,
  //       data: {
  //         ...i.data,
  //         DisputeStatus: i.data?.DisputeStatus,
  //       },
  //     };
  //   });
  // }

  // filter failures...need to do something with this to re-request
  // ...should not have any errors, but should log and resolve in case
  const successful = allDisputeStatusUpdates.filter((d) => {
    return d.success;
  });
  console.log('all disputes filtered ===> ', JSON.stringify(successful));

  // loop through and update the status of each result in the disputes DB
  if (successful.length) {
    try {
      console.log('*** IN UPDATE DATABASE WITH NEW STATUS ***');
      // alerts come with client keys which are also our keys
      const updates = await Promise.all(
        successful.map(async (item) => {
          try {
            const id = item.data?.ClientKey;
            const disputeId = item.data?.DisputeStatus?.DisputeStatusDetail?.DisputeId;
            if (!item.data || !id || !disputeId) {
              const l1 = transactionLogger.createTransaction(
                id,
                'DisputeInflightCheck:UpdateDisputeDB',
                JSON.stringify(item.data),
              );
              await transactionLogger.logger.create(l1);
              return 'missing params';
            }
            const currentDispute = await DB.disputes.get(id, `${disputeId}`);
            console.log('currentDispute', currentDispute);
            const complete = item.data?.DisputeStatus?.DisputeStatusDetail?.Status.toLowerCase() === 'completedispute';
            const tuDate =
              item.data?.DisputeStatus.DisputeStatusDetail?.ClosedDisputes?.LastUpdatedDate ||
              item.data?.DisputeStatus.DisputeStatusDetail?.OpenDisputes?.LastUpdatedDate;
            const closedOn = complete ? dayjs(tuDate, 'MM/DD/YYYY').toISOString() : currentDispute.closedOn;
            const mappedDispute = DB.disputes.generators.createUpdateDisputeDBRecord(item.data, closedOn);
            const updatedDispute = {
              ...currentDispute,
              ...mappedDispute,
            };
            console.log('updatedDispute', updatedDispute);
            await DB.disputes.update(updatedDispute);
            return 'success';
          } catch (err) {
            return err;
          }
        }),
      );
      console.log('dispute updates ===> ', JSON.stringify(updates));
    } catch (err) {
      const error = errorLogger.createError(
        'alert_notification_operation',
        'DisputeInflightCheck:UpdateDisputeDB',
        JSON.stringify(err),
      );
      await errorLogger.logger.create(error);
      return { success: false, error: err };
    }
  }

  // Only want to get investigation results for completed disputes
  const completed = allDisputeStatusUpdates.filter(
    (d) => d.data?.DisputeStatus?.DisputeStatusDetail?.Status.toLowerCase() === 'completedispute',
  );
  console.log('completed disputes ===> ', JSON.stringify(completed));
  if (completed.length) {
    try {
      console.log('*** IN GET INVESTIGATION RESULTS ***');
      const alerted = await Promise.all(
        completed.map(async (item) => {
          try {
            const id = item.data?.ClientKey;
            const disputeId = item.data?.DisputeStatus?.DisputeStatusDetail?.DisputeId;
            if (!item.data || !id || !disputeId) {
              const l1 = transactionLogger.createTransaction(
                id,
                'DisputeInflightCheck:GetInvestigationResults',
                JSON.stringify(item.data),
              );
              await transactionLogger.logger.create(l1);
              return;
            }
            const payload = {
              accountCode,
              username,
              message: JSON.stringify({ disputeId: disputeId.toString() }),
              agent,
              auth,
              identityId: id,
            };
            //need to check if IR exists for this dispute
            console.log('CHECKING FOR EXISTING RESULTS');
            const dispute = await DB.disputes.get(id, disputeId.toString());
            if (dispute.disputeInvestigationResults) {
              return { success: true, error: null, data: 'IR already received' };
            }

            console.log('CALLING FULFILL');
            const fulfilled = await new FulfillV2(payload).run();
            if (!fulfilled.success) throw `fulfilled failed; error: ${fulfilled.error}; data: ${fulfilled.data}`;
            console.log('CALLING GET INVESTIGATION RESULTS');
            const synced = await GetInvestigationResults(payload);
            let response = synced
              ? { success: true, error: null, data: synced.data }
              : { success: false, error: 'failed to get investigation results' };
            console.log('response ===> ', response);
            return response;
          } catch (err) {
            return err;
          }
        }),
      );
      return { success: true, error: false, data: JSON.stringify(alerted) };
    } catch (err) {
      const error = errorLogger.createError(
        'alert_notification_operation',
        'DisputeInflightCheck:GetInvestigationResults',
        JSON.stringify(err),
      );
      await errorLogger.logger.create(error);
      return { success: false, error: err };
    }
  }
  return { success: true, error: false, data: 'Fall through success' };
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
export const GetTrendingData = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error: interfaces.IErrorResponse | interfaces.INil;
  data: any;
}> => {
  // validate incoming message
  const payload: interfaces.IGetTrendingDataPayload = {
    id: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<interfaces.IGetTrendingDataPayload>('getTrendingDataRequest');

  if (!validate(payload)) throw `Malformed message=${payload}`;

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
    const data = resp.Envelope?.Body?.GetTrendingDataResponse?.GetTrendingDataResult;
    const responseType = data?.ResponseType;
    const error = data?.ErrorResponse;

    // log tu responses
    const l1 = transactionLogger.createTransaction(identityId, 'GetTrendingData:data', JSON.stringify(data));
    const l2 = transactionLogger.createTransaction(identityId, 'GetTrendingData:type', JSON.stringify(responseType));
    const l3 = transactionLogger.createTransaction(identityId, 'GetTrendingData:error', JSON.stringify(error));
    await transactionLogger.logger.create(l1);
    await transactionLogger.logger.create(l2);
    await transactionLogger.logger.create(l3);

    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };

    // log success response
    const l4 = transactionLogger.createTransaction(identityId, 'GetTrendingData:response', JSON.stringify(response));
    await transactionLogger.logger.create(l4);

    return response;
  } catch (err) {
    const error = errorLogger.createError(identityId, 'GetTrendingData', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: null };
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
export const GetCreditScoreTracking = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error: interfaces.IErrorResponse | interfaces.INil;
  data: CreditScoreTracking | null;
}> => {
  // validate incoming message
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${payload}`;

  const db = DB;

  try {
    const resp = await db.creditScoreTrackings.get(payload.id, 'transunion');
    const l1 = transactionLogger.createTransaction(identityId, 'GetTrendingData:data', JSON.stringify(resp));
    await transactionLogger.logger.create(l1);
    return { success: true, error: null, data: resp };
  } catch (err) {
    const error = errorLogger.createError(identityId, 'GetCreditScoreTracking', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: null };
  }
};

/**
 * Return the dispute investigation results
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Full message format (fullfillment key required)...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const GetInvestigationResultsByID = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error: interfaces.IErrorResponse | interfaces.INil;
  data: any;
}> => {
  // validate incoming message
  const payload: interfaces.IGetInvestigationResultsByIdRequest = {
    userId: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<interfaces.IGetInvestigationResultsByIdRequest>('getInvestigationResultsRequestById');
  if (!validate(payload)) throw `Malformed message=${message}`;

  const db = DB;

  try {
    const resp = await db.investigationResults.get(payload.id, payload.userId);
    return { success: true, error: null, data: resp };
  } catch (err) {
    const error = errorLogger.createError(identityId, 'GetInvestigationResultsByID', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: null };
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
export const GetCreditBureauResultsByID = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error: interfaces.IErrorResponse | interfaces.INil;
  data: any;
}> => {
  // validate incoming message
  const payload: interfaces.IGetInvestigationResultsByIdRequest = {
    userId: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<interfaces.IGetInvestigationResultsByIdRequest>('getInvestigationResultsRequestById');
  if (!validate(payload)) throw `Malformed message=${message}`;

  const db = DB;

  try {
    const resp = await db.creditBureauResults.get(payload.id, payload.userId);
    return { success: true, error: null, data: resp };
  } catch (err) {
    const error = errorLogger.createError(identityId, 'GetCreditBureauResultsByID', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: null };
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
export const GetAllDisputesByUser = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error: interfaces.IErrorResponse | interfaces.INil;
  data: Dispute[];
}> => {
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;

  const db = DB;

  try {
    const resp = await db.disputes.list(payload.id);
    return { success: true, error: null, data: resp };
  } catch (err) {
    const error = errorLogger.createError(identityId, 'GetAllDisputesByUser', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: null };
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
export const GetCurrentDisputeByUser = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error: interfaces.IErrorResponse | interfaces.INil;
  data: Dispute;
}> => {
  const payload: interfaces.IGenericRequest = { id: identityId };
  const validate = ajv.getSchema<interfaces.IGenericRequest>('getRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;

  const db = DB;

  try {
    const disputes = await db.disputes.list(payload.id);
    const resp = disputes.sort((a, b) => {
      return new Date(b.createdOn).valueOf() - new Date(a.createdOn).valueOf();
    })[0];
    return { success: true, error: null, data: resp };
  } catch (err) {
    const error = errorLogger.createError(identityId, 'GetCurrentDisputeByUser', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: null };
  }
};

// async queryDispute(): Promise<Dispute[]> {
//   return await this.db.disputes.list(this.prepped.id);
//   return disputes.sort((a, b) => {
//     return new Date(b.createdOn).valueOf() - new Date(a.createdOn).valueOf();
//   });
// }
