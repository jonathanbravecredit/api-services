// const https = require('https');
// const urlParse = require("url").URL;
import * as https from 'https';
import * as AWS from 'aws-sdk';
import { Endpoint } from 'aws-sdk';
import { URL } from 'url';
import { IEnrollResponse } from 'lib/interfaces/enroll.interface';
import V4 from 'aws-sdk/lib/signers/v4';
import Util from 'aws-sdk/lib/util';
const appsyncUrl = new Endpoint(process.env.GRAPHQL_APIENDPOINTOUTPUT);
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

export const syncAndSaveEnroll = async (res: IEnrollResponse): Promise<string> => {
  console.log('res in sync and save', res);
  const req = new AWS.HttpRequest(appsyncUrl, region);

  const item = {
    input: {
      name: 'Lambda Item',
      description: 'Item Generated from Lambda',
    },
  };

  req.method = 'POST';
  req.path = '/graphql';
  req.headers.host = endpoint;
  req.headers['Content-Type'] = 'application/json';
  req.body = JSON.stringify({
    query: getAppDataQuery,
    operationName: 'getAppData',
    variables: item,
  });

  const signer = new V4(req, 'appsync', true);
  signer.addAuthorization(AWS.config.credentials, Util.date.getDate());

  console.log('request', req);
  const data = await new Promise((resolve, reject) => {
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      let data = '';

      result.on('data', (chunk) => {
        data += chunk;
      });

      result.on('end', () => {
        resolve(JSON.parse(data.toString()));
      });
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });
  console.log('data', data);
  return JSON.stringify({ Status: 'Success' });
};
