import 'reflect-metadata';
import * as dayjs from 'dayjs';
import { DB } from 'libs/utils/db/db';
import { DynamoDB } from 'aws-sdk';
import { UpdateAppDataInput } from 'src/api/api.service';
import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import { CreditScoreMaker } from 'libs/utils/db/credit-scores/model/credit-scores.model';
import { safeParse } from 'libs/utils';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  const modifies = records.filter((r) => r.eventName === 'MODIFY');

  /*================*/
  //    MODIFIES    //
  /*================*/
  try {
    await Promise.all(
      modifies.map(async (record: DynamoDBRecord) => {
        const stream: StreamRecord = record.dynamodb || {};
        const { OldImage, NewImage } = stream;
        const oldImage = DynamoDB.Converter.unmarshall(OldImage) as unknown as UpdateAppDataInput;
        const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as UpdateAppDataInput;
        // update the db navbar badge with true;
        const oldFulfilledOn = oldImage.agencies?.transunion?.fulfilledOn;
        const newFulfilledOn = newImage.agencies?.transunion?.fulfilledOn;
        const changed = dayjs(newFulfilledOn).isAfter(oldFulfilledOn);
        if (changed) {
          const spo = newImage.agencies?.transunion?.fulfillVantageScore?.serviceProductObject;
          if (spo) {
            const { riskScore } = safeParse(spo, 'CreditScoreType') as { riskScore: number };
            if (riskScore != null) {
              const sub = newImage.id;
              const scoreId = new Date().valueOf();
              const bureauId = 'transunion';
              const creditScore = new CreditScoreMaker(sub, scoreId, bureauId, riskScore);
              try {
                await DB.creditScoreHistory.create(creditScore);
              } catch (err) {
                console.log('log credit score error: ', JSON.stringify(err));
              }
            }
          }
        }
      }),
    );
  } catch (err) {
    console.log('monitor fulfills error: ', err);
  }
};
