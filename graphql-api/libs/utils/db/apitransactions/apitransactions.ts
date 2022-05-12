import { AttributeValue } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { IBatchMsg } from 'libs/interfaces/batch.interfaces';
const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const tableName = 'APITransactionLog';

export const parallelScanTransactionsLog = async (
  esk: { [key: string]: AttributeValue } | undefined,
  segment: number,
  totalSegments: number,
): Promise<IBatchMsg<DynamoDB.DocumentClient.Key> | undefined> => {
  let params: DynamoDB.DocumentClient.ScanInput = {
    TableName: tableName, // I need a big table for testing
    ExclusiveStartKey: esk,
    Segment: segment,
    TotalSegments: totalSegments,
  };
  try {
    const items: DynamoDB.DocumentClient.ScanOutput = await db.scan(params).promise();
    const { LastEvaluatedKey, Items } = items;
    // write the records to the reports table
    // then write the key back
    return {
      lastEvaluatedKey: LastEvaluatedKey,
      items: Items,
      segment: segment,
      totalSegments: totalSegments,
    };
  } catch (err) {
    console.log('err ==> ', err);
  }
};
