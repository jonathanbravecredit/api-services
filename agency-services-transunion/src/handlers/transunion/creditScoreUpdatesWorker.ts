import 'reflect-metadata';
import { AppSyncResolverEvent, SQSEvent, SQSHandler } from 'aws-lambda';
import * as https from 'https';
import * as fs from 'fs';
import * as queries from 'lib/proxy';
import * as secrets from 'lib/utils/secrets/secrets';
import { DB } from 'lib/utils/db/db';
import ErrorLogger from 'lib/utils/db/logger/logger-errors';
import TransactionLogger from 'lib/utils/db/logger/logger-transactions';
import { IFulfillServiceProductResponse, IProxyRequest, ITransunionBatchPayload } from 'lib/interfaces';
import { IVantageScore } from 'lib/interfaces/transunion/vantage-score.interface';
import { CreditScoreTracking } from 'lib/utils/db/credit-score-tracking/model/credit-score-tracking';

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
let message;
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
export const main: SQSHandler = async (event: SQSEvent): Promise<any> => {
  // prep work
  try {
    const secretJSON = await secrets.getSecretKey(transunionSKLoc);
    const { tuKeyPassphrase, tuPassword } = JSON.parse(secretJSON);
    password = tuPassword;
    passphrase = tuKeyPassphrase;
    user = `${username}:${password}`;
    auth = 'Basic ' + Buffer.from(user).toString('base64');
  } catch (err) {
    const error = errorLogger.createError('credit_score_updates_operation', 'get_secrets_failure', JSON.stringify(err));
    errorLogger.logger.create(error);
    return { success: false, error: { error: `Error gathering/reading secrets=${err}` } };
  }
  // prep work
  try {
    const prefix = tuEnv === 'dev' ? 'dev' : 'prod';
    key = fs.readFileSync(`/opt/${prefix}-tubravecredit.key`);
    cert = fs.readFileSync(`/opt/${prefix}-brave.credit.crt`);
    cacert = fs.readFileSync(`/opt/${prefix}-Root-CA-Bundle.crt`);
  } catch (err) {
    const error = errorLogger.createError(
      'credit_score_updates_operation',
      'get_certificates_failure',
      JSON.stringify(err),
    );
    errorLogger.logger.create(error);
    return { success: false, error: { error: `Error gathering/reading cert=${err}` } };
  }

  try {
    const records = event.Records.map((r) => {
      return JSON.parse(r.body) as ITransunionBatchPayload<{ id: string }>;
    });
    const httpsAgent = new https.Agent({
      key,
      cert,
      passphrase,
    });

    await Promise.all(
      records.map(async (rec) => {
        const identityId = rec.message.id;
        const payload: IProxyRequest = {
          accountCode,
          username,
          message,
          agent: httpsAgent,
          auth,
          identityId,
        }; // don't pass the agent in the queue;
        const fulfill = await queries.Fulfill(payload); // THIS NEEDS TO BE REWORKED
        const score = await DB.creditScoreTrackings.get(payload.identityId, 'transunion');
        const { success } = fulfill;
        let fulfillVantageScore: IFulfillServiceProductResponse;
        if (success) {
          const prodResponse = fulfill.data?.ServiceProductFulfillments.ServiceProductResponse; //returnNestedObject<any>(fulfill, 'ServiceProductResponse');
          if (!prodResponse) return;
          if (prodResponse instanceof Array) {
            fulfillVantageScore = prodResponse.find((item: IFulfillServiceProductResponse) => {
              return item['ServiceProduct'] === 'TUCVantageScore3';
            });
          } else if (prodResponse['ServiceProduct'] === 'TUCVantageScore3') {
            fulfillVantageScore = prodResponse || null;
          }
          const prodObj = fulfillVantageScore.ServiceProductObject;
          let vantageScore: IVantageScore;
          if (typeof prodObj === 'string') {
            vantageScore = JSON.parse(prodObj);
          } else if (typeof prodObj === 'object') {
            vantageScore = prodObj;
          }
          // parse the new score
          const {
            CreditScoreType: { riskScore },
          } = vantageScore;
          if (!riskScore) return;
          // step 2c. move the current score to the prior score field. update the current score with the score from the fulfill results
          const priorScore = score.currentScore;
          // step 2d. note if the delta.
          const delta = riskScore - priorScore;
          const newScore: CreditScoreTracking = {
            ...score,
            delta,
            priorScore,
            currentScore: riskScore,
          };
          // step 2e. save record to database and move to next record.
          await DB.creditScoreTrackings.update(newScore);
        }
      }),
    );
    const results = {
      success: true,
      error: null,
      data: `Transunion credit score updates worker ${records.length} records`,
    };
    return JSON.stringify(results);
  } catch (err) {
    const error = errorLogger.createError('credit_score_updates_system', 'unknown_server_error', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  }
};
