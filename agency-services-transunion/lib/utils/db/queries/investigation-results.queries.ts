import * as AWS from 'aws-sdk';
import { PutItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { InvestigationResult } from 'lib/utils/db/models/investigation-results.model';

const db = new AWS.DynamoDB();
const store = new DynamoStore(InvestigationResult);

export const getInvestigationResult = (id: string, userId: string): Promise<InvestigationResult> => {
  return store.get(id, userId).exec();
};

export const createInvestigationResult = (report: InvestigationResult): Promise<PutItemOutput> => {
  const createdOn = new Date().toISOString();
  const newReport = {
    ...report,
    createdOn,
    modifiedOn: createdOn,
  };
  return store
    .put(newReport)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const updateInvestigationResult = (report: InvestigationResult): Promise<PutItemOutput> => {
  const modifiedOn = new Date().toISOString();
  const newReport = {
    ...report,
    modifiedOn,
  };
  return store
    .put(newReport)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const deleteInvestigationResult = (id: string, userId: string): Promise<DeleteItemOutput> => {
  return store
    .delete(id, userId)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const describeInvestigationResults = (): Promise<number> => {
  const params = {
    TableName: 'InvestigationResults',
  };

  return db
    .describeTable(params)
    .promise()
    .then((res) => res.Table.ItemCount)
    .catch((err) => err);
};
