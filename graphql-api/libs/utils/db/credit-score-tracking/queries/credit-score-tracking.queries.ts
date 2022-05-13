import * as AWS from 'aws-sdk';
import { PutItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { CreditScoreTracking } from 'libs/utils/db/credit-score-tracking/model/credit-score-tracking';

const db = new AWS.DynamoDB();
const store = new DynamoStore(CreditScoreTracking);

export const getCreditScoreTracking = (userId: string, bureauId: string): Promise<CreditScoreTracking> => {
  return store
    .get(userId, bureauId)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const listCreditScoresTrackings = (): Promise<CreditScoreTracking[]> => {
  return store
    .scan()
    .execFetchAll()
    .then((res) => res)
    .catch((err) => err);
};

export const createCreditScoreTracking = (score: CreditScoreTracking): Promise<PutItemOutput> => {
  const createdOn = new Date().toISOString();
  const newScore = {
    ...score,
    createdOn,
    modifiedOn: createdOn,
  };
  return store
    .put(newScore)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const updateCreditScoreTracking = (score: CreditScoreTracking): Promise<PutItemOutput> => {
  const modifiedOn = new Date().toISOString();
  const newScore = {
    ...score,
    modifiedOn,
  };
  return store
    .put(newScore)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const deleteCreditScoreTracking = (userId: string, bureauId: string): Promise<DeleteItemOutput> => {
  return store
    .delete(userId, bureauId)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const describeCreditScoreTrackings = (): Promise<number> => {
  const params = {
    TableName: 'CreditScoreTrackings',
  };

  return db
    .describeTable(params)
    .promise()
    .then((res) => res.Table.ItemCount)
    .catch((err) => err);
};

export const batchUpdateCreditScoreTracking = (scores: CreditScoreTracking[]): Promise<PutItemOutput> => {
  return store
    .batchWrite()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
