import 'reflect-metadata';
import { AppSyncResolverEvent } from 'aws-lambda';
import * as https from 'https';
import * as fs from 'fs';
import * as queries from 'lib/proxy';
import * as secrets from 'lib/utils/secrets/secrets';
import { DB } from 'lib/utils/db/db';
import ErrorLogger from 'lib/utils/db/logger/logger-errors';
import TransactionLogger from 'lib/utils/db/logger/logger-transactions';
import { IFulfillServiceProductResponse } from 'lib/interfaces';
import { IVantageScore } from 'lib/interfaces/transunion/vantage-score.interface';
import { CreditScoreTracking } from 'lib/utils/db/credit-score-tracking/model/credit-score-tracking';
import { listCreditScores } from 'lib/proxy';

// request.debug = true; import * as request from 'request';
const errorLogger = new ErrorLogger();
const transactionLogger = new TransactionLogger();

interface IScore {
  id: string;
  agencies: {
    transunion: {
      enrolled: boolean;
      fulfillVantageScore: {
        bureau: string;
        errorReponse: unknown;
        serviceProduct: string;
        serviceProductFullfillmentKey: string;
        serviceProductObject: string;
        serviceProductTypeId: string;
        serviceProductValue: string;
        status: string;
      };
    };
  };
}

/**
 * Handler that processes single requests for Transunion services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @returns Lambda proxy response
 */
export const main: any = async (event: AppSyncResolverEvent<any>): Promise<any> => {
  const action: string = event?.arguments?.action;
  const message: string = event?.arguments?.message;

  try {
    // go to the app database and get all the records then form the payload
    // and create the records in the creditScoreTrackings Table
    const {
      data: {
        data: {
          listAppDatas: { items: scores },
        },
      },
    } = await listCreditScores();
    // filter out those people who signed up but never enrolled
    const enrolled = scores.filter((score: IScore) => {
      return score.agencies?.transunion?.enrolled;
    });
    await Promise.all(
      enrolled.map(async (score: IScore) => {
        const prodObj = score.agencies?.transunion?.fulfillVantageScore?.serviceProductObject;
        let vantageScore: IVantageScore;
        if (prodObj) {
          if (typeof prodObj === 'string') {
            vantageScore = JSON.parse(prodObj);
          } else if (typeof prodObj === 'object') {
            vantageScore = prodObj;
          }
        }
        const currentScore = vantageScore?.CreditScoreType?.riskScore || null;
        const now = new Date().toISOString();
        const payload: CreditScoreTracking = {
          userId: score.id,
          bureauId: 'transunion',
          priorScore: null,
          currentScore: currentScore,
          delta: null,
          createdOn: now,
          modifiedOn: now,
        };
        await DB.creditScoreTrackings.create(payload);
      }),
    );
    const results = { success: true, error: null, data: null };
    return JSON.stringify(results);
  } catch (err) {
    const error = errorLogger.createError('seed_credit_score_updates', 'unknown_server_error', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return JSON.stringify({ success: false, error: { error: `Unknown server error=${err}` } });
  }
};
