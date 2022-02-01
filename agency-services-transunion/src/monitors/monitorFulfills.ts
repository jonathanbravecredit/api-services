import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { DB } from 'lib/utils/db/db';
import { updateNavbarDisputesBadge } from 'lib/utils/db/dynamo-db/dynamo';
import { UpdateAppDataInput } from 'src/api/api.service';
import { TransunionUtil as tuUtil } from 'lib/utils/transunion/transunion';
import { CreditScoreMaker } from 'lib/utils/db/credit-scores/model/credit-scores.model';
import * as dayjs from 'dayjs';
import * as _ from 'lodash';
import { IFulfillVantageScore } from 'lib/interfaces';
import { safeParse } from 'lib/utils';

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  const modifies = records.filter((r) => r.eventName === 'MODIFY');

  /*================*/
  //    INSERTS     //
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
        const changed = dayjs(oldFulfilledOn).isAfter(newFulfilledOn);
        if (changed) {
          const spo = newImage.agencies?.transunion?.fulfillVantageScore?.serviceProductObject;
          if (spo) {
            const creditscore = safeParse(spo, 'CreditScoreType');
            const { riskScore } = _.find(creditscore, 'riskScore');
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
