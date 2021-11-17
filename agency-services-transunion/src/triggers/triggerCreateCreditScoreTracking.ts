import 'reflect-metadata';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { DB } from 'lib/utils/db/db';
import { IVantageScore } from 'lib/interfaces/transunion/vantage-score.interface';
import { CreditScoreTracking } from 'lib/utils/db/credit-score-tracking/model/credit-score-tracking';
import { UpdateAppDataInput } from 'src/api/api.service';
import ErrorLogger from 'lib/utils/db/logger/logger-errors';

// request.debug = true; import * as request from 'request';
const errorLogger = new ErrorLogger();

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  // mailchimp emails
  try {
    await Promise.all(
      records.map(async (record: DynamoDBRecord) => {
        const message = JSON.stringify(record, null, 2);

        if (record.eventName == 'MODIFY') {
          const stream: StreamRecord = record.dynamodb || {};
          const { OldImage, NewImage } = stream;
          if (!OldImage || !NewImage) return;
          const newImage = AWS.DynamoDB.Converter.unmarshall(NewImage) as unknown as UpdateAppDataInput;
          const oldImage = AWS.DynamoDB.Converter.unmarshall(OldImage) as unknown as UpdateAppDataInput;
          const newEnrolled = newImage.agencies?.transunion?.enrolled;
          const oldEnrolled = oldImage.agencies?.transunion?.enrolled;
          if (!oldEnrolled && newEnrolled) {
            //user enrolls for the first time
            const prodObj = newImage.agencies.transunion.fulfillVantageScore.serviceProductObject;
            let vantageScore: IVantageScore;
            if (typeof prodObj === 'string') {
              vantageScore = JSON.parse(prodObj);
            } else if (typeof prodObj === 'object') {
              vantageScore = prodObj;
            }
            const currentScore = vantageScore.CreditScoreType.riskScore || null;
            const now = new Date().toISOString();
            const payload: CreditScoreTracking = {
              userId: newImage.id,
              bureauId: 'transunion',
              priorScore: null,
              currentScore: currentScore,
              delta: null,
              createdOn: now,
              modifiedOn: now,
            };
            await DB.creditScoreTrackings.create(payload);
          }
        }
      }),
    );
  } catch (err) {
    const error = errorLogger.createError(
      'trigger_create_creditScore_tracking',
      'trigger_create_creditScore_tracking:stream_error',
      JSON.stringify(err),
    );
    await errorLogger.logger.create(error);
  }
};
