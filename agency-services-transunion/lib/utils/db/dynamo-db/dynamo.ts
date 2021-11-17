const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'us-east-2' });

const APP_DATA =
  process.env.NODE_ENV === 'prod'
    ? 'AppData-4tpaga7rzjayhk75opsmpeurme-prod'
    : 'AppData-rr5wtr4ev5exlbutrkih3r5lhq-dev';

const tableName = APP_DATA;

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
