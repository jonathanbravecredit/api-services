// const https = require('https');
// const urlParse = require("url").URL;
import * as https from 'https';
import * as AWS from 'aws-sdk';
import { Endpoint } from 'aws-sdk';
import * as aws4 from 'aws4';
import { IEnrollResponse } from 'lib/interfaces/enroll.interface';
// import V4 from 'aws-sdk/lib/signers/v4';

console.log('endpoint output', process.env.GRAPHQL_APIENDPOINTOUTPUT);

const appsyncUrl = new Endpoint(process.env.APPSYNC_ENDPOINT);
const region = process.env.AWS_REGION;
const endpoint = appsyncUrl.hostname;

console.log('env vars', appsyncUrl, region, endpoint);

import { getAppDataQuery } from './graphql';

// const graphqlQuery = require('./query.js').mutation;

// export const syncAndSaveEnroll = async (res: IEnrollResponse): Promise<string> => {
//   console.log('res', res);
//   if (!res['a:ClientKey']) return JSON.stringify({ Status: 'Failed, no ID returned' });
//   const data = await getAppData(res['a:ClientKey']);
//   console.log('data back from query', data);
//   if (!data) return JSON.stringify({ Status: 'Failed, no data returned from query' });
//   return JSON.stringify({ Status: 'Success' });
// };

export const syncAndSaveEnroll1 = async (res: IEnrollResponse): Promise<string> => {
  console.log('res in sync and save', res);
  const variables = { id: res.EnrollResponse.EnrollResult['a:ClientKey'] };
  const opts = {
    host: endpoint,
    region: region,
    headers: {
      'Content-Type': 'application/json',
    },
    path: '/graphql',
    method: 'POST',
    service: 'appsync',
    body: JSON.stringify({
      query: getAppDataQuery,
      operationName: 'getAppData',
      variables,
    }),
  };
  // const req = new AWS.HttpRequest(appsyncUrl, region);

  // req.method = 'POST';
  // req.path = '/graphql';
  // // req.headers.service = 'appsync';
  // req.headers.host = endpoint;
  // req.headers['Content-Type'] = 'application/json';
  // req.body = JSON.stringify({
  //   query: getAppDataQuery,
  //   operationName: 'getAppData',
  //   variables,
  // });

  console.log('req before signing', opts);
  aws4.sign(opts);
  console.log('req after signing', opts);

  const data = await new Promise((resolve, reject) => {
    const httpRequest = https.request(opts, (result) => {
      let data = '';

      result.on('data', (chunk) => {
        data += chunk;
      });

      result.on('end', () => {
        resolve(JSON.parse(data.toString()));
      });
    });

    httpRequest.write(opts.body);
    httpRequest.end();
  });
  console.log('data', data);
  return JSON.stringify({ Status: 'Success' });
};
