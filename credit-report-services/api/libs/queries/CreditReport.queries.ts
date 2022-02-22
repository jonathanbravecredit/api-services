import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { CreditReport } from 'libs/models/CreditReport.model';

const store = new DynamoStore(CreditReport);

export const getReport = (userId: string, version: number): Promise<CreditReport> => {
  return store
    .get(userId, version)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const getCurrentReport = (userId: string): Promise<CreditReport> => {
  return store
    .get(userId, 0)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};

export const createReport = (report: CreditReport): Promise<PutItemOutput> => {
  const createdOn = new Date().toISOString();
  const creditReport = {
    ...report,
    createdOn,
    modifiedOn: createdOn,
  };
  return store
    .put(creditReport)
    .ifNotExists()
    .exec()
    .then((res) => res)
    .catch((err) => {
      console.log('error: ', err);
      return err;
    });
};

export const updateReport = (report: CreditReport): Promise<PutItemOutput> => {
  const modifiedOn = new Date().toISOString();
  const newDispute = {
    ...report,
    modifiedOn,
  };
  return store
    .put(newDispute)
    .exec()
    .then((res) => res)
    .catch((err) => err);
};
