import * as AWS from 'aws-sdk';
import { PutItemOutput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { CreditBureauReportResult } from 'libs/utils/db/credit-bureau/model/credit-bureau.model';

const db = new AWS.DynamoDB();
const store = new DynamoStore(CreditBureauReportResult);

export const getCreditBureauReportResult = (id: string, userId: string): Promise<CreditBureauReportResult> => {
  return store
    .get(id, userId)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const createCreditBureauReportResult = (report: CreditBureauReportResult): Promise<PutItemOutput> => {
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

export const updateCreditBureauReportResult = (report: CreditBureauReportResult): Promise<PutItemOutput> => {
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

export const deleteCreditBureauReportResult = (id: string, userId: string): Promise<DeleteItemOutput> => {
  return store
    .delete(id, userId)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const describeCreditBureauReportResults = (): Promise<number> => {
  const params = {
    TableName: 'CreditBureauReportResults',
  };

  return db
    .describeTable(params)
    .promise()
    .then((res) => res.Table.ItemCount)
    .catch((err) => err);
};
