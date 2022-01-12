import 'reflect-metadata';
import * as https from 'https';
import * as fs from 'fs';
import { GetDisputeStatusByID } from 'lib/proxy';
import * as secrets from 'lib/utils/secrets/secrets';
import { DB } from 'lib/utils/db/db';
import { DISPUTE_CLEANUP_LIST } from 'lib/data/disputeCleanupList';
import { AppSyncResolverEvent } from 'aws-lambda';
import ErrorLogger from 'lib/utils/db/logger/logger-errors';
import TransactionLogger from 'lib/utils/db/logger/logger-transactions';
import { FulfillDisputes, GetInvestigationResults } from 'lib/proxy';

// request.debug = true; import * as request from 'request';
const errorLogger = new ErrorLogger();
const transactionLogger = new TransactionLogger();

const transunionSKLoc = process.env.TU_SECRET_LOCATION;
const tuEnv = process.env.TU_ENV;
let key: Buffer;
let cert: Buffer;
let cacert: Buffer;
let username = 'CC2BraveCredit';
let accountCode = 'M2RVc0ZZM0Rwd2FmZA';
let user;
let auth;
let passphrase;
let password;

/**
 * Handler that processes single requests for Transunion services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @returns Lambda proxy response
 */
export const main: any = async (event: AppSyncResolverEvent<any>): Promise<any> => {
  const action: string = event?.arguments?.action;
  const message: string = event?.arguments?.message; // stringified disputeId, and sub

  try {
    const secretJSON = await secrets.getSecretKey(transunionSKLoc);
    const { tuKeyPassphrase, tuPassword } = JSON.parse(secretJSON);
    password = tuPassword;
    passphrase = tuKeyPassphrase;
    user = `${username}:${password}`;
    auth = 'Basic ' + Buffer.from(user).toString('base64');
  } catch (err) {
    const error = errorLogger.createError('clean_open_disputes_operations', 'get_secrets_failure', JSON.stringify(err));
    errorLogger.logger.create(error);
    return { success: false, error: { error: `Error gathering/reading secrets=${err}` } };
  }

  try {
    const prefix = tuEnv === 'dev' ? 'dev' : 'prod';
    key = fs.readFileSync(`/opt/${prefix}-tubravecredit.key`);
    cert = fs.readFileSync(`/opt/${prefix}-brave.credit.crt`);
    cacert = fs.readFileSync(`/opt/${prefix}-Root-CA-Bundle.crt`);
  } catch (err) {
    const error = errorLogger.createError(
      'clean_open_disputes_operations',
      'get_certificates_failure',
      JSON.stringify(err),
    );
    errorLogger.logger.create(error);
    return { success: false, error: { error: `Error gathering/reading cert=${err}` } };
  }

  try {
    const httpsAgent = new https.Agent({
      key,
      cert,
      passphrase,
    });

    const cleanupList = DISPUTE_CLEANUP_LIST;
    const statusUpdates = await Promise.all(
      cleanupList.map(async (item) => {
        const message = JSON.stringify({ disputeId: item.disputeId });
        const payload = {
          accountCode,
          username,
          message,
          agent: httpsAgent,
          auth,
          identityId: item.id,
        };
        return await GetDisputeStatusByID(payload);
      }),
    );

    const successful = statusUpdates.filter((u) => u.success);
    console.log('successful ===> ', JSON.stringify(successful));

    if (successful.length) {
      try {
        const updates = await Promise.all(
          successful.map(async (item) => {
            try {
              const id = item.data?.ClientKey;
              const disputeId = item.data?.DisputeStatus?.DisputeStatusDetail?.DisputeId;
              if (!item.data || !id || !disputeId) {
                const l1 = transactionLogger.createTransaction(
                  id,
                  'CleanUpOpenDisputes:UpdateDisputeDB',
                  JSON.stringify(item.data),
                );
                await transactionLogger.logger.create(l1);
                return;
              }
              const currentDispute = await DB.disputes.get(id, `${disputeId}`);
              console.log('currentDispute', currentDispute);
              const closedOn =
                item.data?.DisputeStatus.DisputeStatusDetail?.ClosedDisputes?.LastUpdatedDate ||
                currentDispute.closedOn;
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
          'clean_open_disputes_operations',
          'CleanUpOpenDisputes:UpdateDisputeDB',
          JSON.stringify(err),
        );
        await errorLogger.logger.create(error);
        return { success: false, error: err };
      }
    }

    const completed = statusUpdates.filter(
      (d) => d.data?.DisputeStatus?.DisputeStatusDetail?.Status.toLowerCase() === 'completedispute',
    );
    console.log('completed disputes ===> ', JSON.stringify(completed));
    if (completed.length) {
      try {
        const alerted = await Promise.all(
          completed.map(async (item) => {
            const id = item.data?.ClientKey;
            const disputeId = item.data?.DisputeStatus?.DisputeStatusDetail?.DisputeId;
            if (!item.data || !id || !disputeId) {
              const l1 = transactionLogger.createTransaction(
                id,
                'CleanUpOpenDisputes:GetInvestigationResults',
                JSON.stringify(item.data),
              );
              await transactionLogger.logger.create(l1);
              return;
            }
            const message = JSON.stringify({ disputeId: `${disputeId}` });
            const payload = {
              accountCode,
              username,
              message,
              agent: httpsAgent,
              auth,
              identityId: id,
            };
            console.log('CALLING FULFILL DISPUTES');
            const fulfilled = await FulfillDisputes(payload);
            console.log('CALLING GET INVESTIGATION RESULTS');
            const synced = await GetInvestigationResults(payload);
            let response = synced
              ? { success: true, error: null, data: synced.data }
              : { success: false, error: 'failed to get investigation results' };
            console.log('response ===> ', response);
            return response;
          }),
        );
        return { success: true, error: false, data: JSON.stringify(alerted) };
      } catch (err) {
        const error = errorLogger.createError(
          'clean_open_disputes_operations',
          'CleanUpOpenDisputes:GetInvestigationResults',
          JSON.stringify(err),
        );
        await errorLogger.logger.create(error);
        return { success: false, error: err };
      }
    }

    return { success: true, error: false, data: 'Fall through success' };
  } catch (err) {
    const error = errorLogger.createError(
      'clean_open_disputes_operations',
      'unknown_server_error',
      JSON.stringify(err),
    );
    await errorLogger.logger.create(error);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  }
};
