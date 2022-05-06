import * as he from 'he';
import * as https from 'https';
import * as qrys from 'libs/proxy/proxy-queries';
import * as interfaces from 'libs/interfaces';
import * as tu from 'libs/transunion';
import ErrorLogger from 'libs/utils/db/logger/logger-errors';
import TransactionLogger from 'libs/utils/db/logger/logger-transactions';
import { DB } from 'libs/utils/db/db';
import { ajv } from 'libs/schema/validation';
import { SoapAid } from 'libs/utils/soap-aid/soap-aid';
import { FulfillV2 } from 'libs/transunion/fulfill/_dnu/Fulfillv2';
import { GetInvestigationResultsV2 } from 'libs/transunion/get-investigation-results/get-investigation-results-v2';
import { START_DISPUTE_RESPONSE } from 'libs/examples/mocks/StartDisputeResponse';
import { FulfillV3 } from 'libs/transunion/fulfill/fulfill-v3';

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
        const fulfilled = await new FulfillV3(payload).run();
        if (!fulfilled.success) throw `fulfilled failed; error: ${fulfilled.error}; data: ${fulfilled.data}`;
        await new GetInvestigationResultsV2(payload).run();
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
