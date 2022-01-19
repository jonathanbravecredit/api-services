import { IFulfillResult } from 'lib/interfaces';
import { IGetEnrollmentData } from 'lib/utils/db/dynamo-db/dynamo.interfaces';
import { TUReportResponseInput } from 'src/api/api.service';
import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'us-east-2' });

const tableName = process.env.APPTABLE;

export const getAllItemsInDB = async () => {
  let params = {
    TableName: tableName,
  };

  let scanResults = [];
  let items;

  do {
    items = await db.scan(params).promise();
    items.Items.forEach((item) => scanResults.push(item));
    params['ExclusiveStartKey'] = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey != 'undefined');

  return scanResults;
};

export const getAllEnrollmentItemsInDB = async (): Promise<IGetEnrollmentData[]> => {
  let params = {
    TableName: tableName,
  };

  let scanResults: IGetEnrollmentData[] = [];
  let items;

  do {
    items = await db.scan(params).promise();
    items.Items.forEach((item) => {
      if (item.agencies?.transunion?.enrolled) {
        scanResults.push({
          id: item.id,
          user: item.user,
          agencies: {
            transunion: {
              enrollmentKey: item.agencies?.transunion?.enrollmentKey,
              serviceBundleFulfillmentKey: item.agencies?.transunion?.serviceBundleFulfillmentKey,
            },
          },
        });
      }
    });
    params['ExclusiveStartKey'] = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey != 'undefined');

  return scanResults;
};

export const getItemsInDB = (id) => {
  const params = {
    Key: {
      id: id,
    },
    TableName: tableName,
  };
  return db
    .get(params)
    .promise()
    .then((res) => res)
    .catch((err) => err);
};

export const updateFulfillReport = (
  id: string,
  fulfillReport: {
    fulfilledOn: string;
    fulfillReport: TUReportResponseInput;
    fulfillMergeReport: TUReportResponseInput;
    fulfillVantageScore: TUReportResponseInput;
    serviceBundleFulfillmentKey: string;
  },
) => {
  let timeStamp = new Date().toISOString(); //always have last updated date
  const params = {
    TableName: tableName,
    Key: {
      id: id,
    },
    // ConditionExpression: 'attribute_exists(queryParam.tableId)',
    UpdateExpression:
      'SET #a.#t.#fo = :fo, #a.#t.#fr = :fr, #a.#t.#fm = :fm, #a.#t.#fs = :fs, #a.#t.#bk = :bk, updatedAt = :m',
    ExpressionAttributeNames: {
      '#a': 'agencies',
      '#t': 'transunion',
      '#fo': 'fulfilledOn',
      '#fr': 'fulfillReport',
      '#fm': 'fulfillMergeReport',
      '#fs': 'fulfillVantageScore',
      '#bk': 'serviceBundleFulfillmentKey',
    },
    ExpressionAttributeValues: {
      ':fo': fulfillReport.fulfilledOn,
      ':fr': fulfillReport.fulfillReport,
      ':fm': fulfillReport.fulfillMergeReport,
      ':fs': fulfillReport.fulfillVantageScore,
      ':bk': fulfillReport.serviceBundleFulfillmentKey,
      ':m': timeStamp,
    },
    ReturnValues: 'UPDATED_NEW',
  };



  return db
    .update(params)
    .promise()
    .then((res) => res)
    .catch((err) => err);
};


export const updateNavbarDisputesBadge = (
  id: string
) => {
  let timeStamp = new Date().toISOString(); //always have last updated date
  const params = {
    TableName: tableName,
    Key: {
      id: id,
    },
    // ConditionExpression: 'attribute_exists(queryParam.tableId)',
    UpdateExpression:
      'SET #n.#d.#b = :t, updatedAt = :m',
    ExpressionAttributeNames: {
      '#n': 'navBar',
      '#d': 'disputes',
      '#b': 'badge',
    },
    ExpressionAttributeValues: {
      ':t': true,
      ':m': timeStamp,
    }
  };



  return db
    .update(params)
    .promise()
    .then((res) => res)
    .catch((err) => err);
};

export const updateEnrollmentStatus = (
  id: string,
  enrolled: boolean,
  status: string,
  statusReasonDescription: string,
) => {
  let timeStamp = new Date().toISOString(); //always have last updated date
  const params = {
    TableName: tableName,
    Key: {
      id: id,
    },
    // ConditionExpression: 'attribute_exists(queryParam.tableId)',
    UpdateExpression: `SET
    #a.#t.#en = :en,
    #a.#t.#den = :en,
    #s = :s,
    #sr = :sr,
    #srd = :srd,
    #lsm = :lsm,
    #nsm = :nsm,
    updatedAt = :m`,
    ExpressionAttributeNames: {
      '#s': 'status',
      '#sr': 'statusReason',
      '#srd': 'statusReasonDescription',
      '#lsm': 'lastStatusModifiedOn',
      '#nsm': 'nextStatusModifiedOn',
      '#a': 'agencies',
      '#t': 'transunion',
      '#en': 'enrolled',
      '#den': 'disputeEnrolled',
    },
    ExpressionAttributeValues: {
      ':s': status,
      ':sr': status,
      ':srd': statusReasonDescription,
      ':lsm': timeStamp,
      ':nsm': -1,
      ':en': enrolled,
      ':m': timeStamp,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  return db
    .update(params)
    .promise()
    .then((res) => res)
    .catch((err) => err);
};
