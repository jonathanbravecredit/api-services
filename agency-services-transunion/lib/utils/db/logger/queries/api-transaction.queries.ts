import * as AWS from 'aws-sdk';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { APITransactionLog } from 'lib/utils/db/logger/model/api-transaction.model';

const db = new AWS.DynamoDB();
const store = new DynamoStore(APITransactionLog);

export const getTransactionLog = (userId: string, transactionid: string): Promise<APITransactionLog> => {
  return store
    .get(userId, transactionid)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const listTransactionLog = (userId: string): Promise<APITransactionLog[]> => {
  return store
    .query()
    .wherePartitionKey(userId)
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const createTransactionLog = (transaction: APITransactionLog): Promise<PutItemOutput> => {
  const createdOn = new Date().toISOString();
  const newTransaction = {
    ...transaction,
    createdOn,
  };
  return store
    .put(newTransaction)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const describeAPITransactionLog = (): Promise<number> => {
  const params = {
    TableName: 'APITransactionLog',
  };

  return db
    .describeTable(params)
    .promise()
    .then((res) => res.Table.ItemCount)
    .catch((err) => err);
};
