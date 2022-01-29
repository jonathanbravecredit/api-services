import { DynamoDBRecord, DynamoDBStreamEvent, DynamoDBStreamHandler, StreamRecord } from "aws-lambda";
import { DynamoDB } from 'aws-sdk';
import { updateNavbarDisputesBadge } from "lib/utils/db/dynamo-db/dynamo";
import { InvestigationResult } from "lib/utils/db/investigation-results/model/investigation-results.model";

export const main: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const records = event.Records;
  const inserts = records.filter(r => r.eventName === 'INSERT');

  /*================*/
  //    INSERTS     //
  /*================*/
  try {
    await Promise.all(
      inserts.map(async (record: DynamoDBRecord) => {
        const stream: StreamRecord = record.dynamodb || {};
        const { NewImage } = stream;
        const newImage = DynamoDB.Converter.unmarshall(NewImage) as unknown as InvestigationResult;
        // update the db navbar badge with true;
        try {
          await updateNavbarDisputesBadge(newImage.userId, true);
        } catch (err) {
          console.log('updateNavBar error 1: ', err);
        }
      })
    )
  } catch (err) {
    console.log('updateNavBar error 2: ', err);
  }
}