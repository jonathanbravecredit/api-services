import * as AWS from 'aws-sdk';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { APIErrorLog } from 'libs/utils/db/logger/model/api-error.model';

const db = new AWS.DynamoDB();
const store = new DynamoStore(APIErrorLog);

export const getErrorLog = (userId: string, errorId: string): Promise<APIErrorLog> => {
  return store
    .get(userId, errorId)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const listErrorLog = (userId: string): Promise<APIErrorLog[]> => {
  return store
    .query()
    .wherePartitionKey(userId)
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const createErrorLog = (error: APIErrorLog): Promise<PutItemOutput> => {
  const createdOn = new Date().toISOString();
  const newError = {
    ...error,
    createdOn,
  };
  return store
    .put(newError)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const describeAPIErrorLog = (): Promise<number> => {
  const params = {
    TableName: 'APIErrorLog',
  };

  return db
    .describeTable(params)
    .promise()
    .then((res) => res.Table.ItemCount)
    .catch((err) => err);
};
