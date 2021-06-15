import * as isomorphicFetch from 'isomorphic-fetch';
import * as AWS from 'aws-sdk';
import gql from 'graphql-tag';
import { polyfill } from 'es6-promise';
import AWSAppSyncClient from 'aws-appsync';
import { AUTH_TYPE } from 'aws-appsync';
import { AWSAppSyncClientOptions } from 'aws-appsync';
import { UpdateAppDataInput } from 'lib/queries/api.service';
import { IEnrollResponse } from 'lib/interfaces/enroll.interface';
import { getAppDataQuery } from 'lib/queries/appdata';

// const AUTH_TYPE = APPSYNC.AUTH_TYPE;
// const AWSAppSyncClient = APPSYNC.default;

const config: AWSAppSyncClientOptions = {
  url: process.env.APPSYNC_ENDPOINT,
  region: process.env.AWS_REGION,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: AWS.config.credentials,
  },
  disableOffline: true,
};
console.log('config', config, process.env.NODE_ENV);

const client = new AWSAppSyncClient(config);

export const syncAndSaveEnroll2 = async (res: IEnrollResponse): Promise<string> => {
  const variables = { id: `us-east2:${res.EnrollResult['a:ClientKey'].split(':').pop()}` };
  console.log('variables', variables);
  try {
    const response = await client.query({
      query: gql(getAppDataQuery),
      variables,
      fetchPolicy: 'network-only',
    });
    console.log('resp', response);
    return JSON.stringify({ Status: 'Success' });
  } catch (err) {
    console.log('Error while trying to fetch data', err);
    throw JSON.stringify(err);
  }
};
