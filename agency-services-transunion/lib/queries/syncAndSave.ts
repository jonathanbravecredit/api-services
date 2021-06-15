import * as https from 'https';
import * as aws4 from 'aws4';
import { IEnrollResponse, IEnrollServiceProductResponse } from 'lib/interfaces/enroll.interface';
import { getAppDataQuery, updateAppDataMutation } from './appdata';
import { TUEnrollResponseInput, UpdateAppDataInput } from 'lib/queries/api.service';
import { returnNestedObject } from 'lib/utils/helpers';
import axios from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql';

const appsyncUrl = process.env.APPSYNC_ENDPOINT;
const region = process.env.AWS_REGION;

/**
 * Takes the enroll response and saves it to the database
 * @param {IEnrollResponse} enroll
 * @returns
 */
export const syncAndSaveEnroll = async (
  enroll: IEnrollResponse,
): Promise<{ status: string; data: any; error?: string }> => {
  const id = `us-east2:${enroll.EnrollResult['a:ClientKey'].split(':').pop()}`;

  let oldData: UpdateAppDataInput;
  let payload1 = {
    query: print(gql(getAppDataQuery)),
    variables: {
      id: id,
    },
  };
  // create the options for the sync up
  let opts1 = {
    method: 'POST',
    host: '24ga46y3gbgodogktqwhh7vryq.appsync-api.us-east-2.amazonaws.com',
    region: region,
    path: 'graphql',
    body: JSON.stringify(payload1),
    service: 'appsync',
  };
  // sign the headers
  // aws4.sign(opts1);
  // send request to graphql endpoint

  try {
    oldData = await syncEnroll(opts1, payload1);
    console.log('old data', oldData);
  } catch (err) {
    return { status: 'failed', data: null, error: `failed during sync=${err}` };
  }
  // mapp the data to the correct inputs
  const enrollmentKey = returnNestedObject(enroll, 'a:EnrollmentKey');
  const prodResponse = returnNestedObject(enroll, 'a:ServiceProductResponse');
  const mapped = mapData(prodResponse);
  //enrich the data
  let newData = {
    ...oldData,
    agencies: {
      ...oldData.agencies,
      transunion: {
        ...oldData.agencies?.transunion,
        enrollmentKey: enrollmentKey,
        enrollReport: mapped.enrollReport,
        enrollMergeReport: mapped.enrollMergeReport,
        enrollVantageScore: mapped.enrollVantageScore,
      },
    },
  };
  console.log('new data', newData);

  // update the options
  let opts2 = {
    method: 'POST',
    path: '/graphql',
    headers: {
      'Content-Type': 'application/json',
      Host: '24ga46y3gbgodogktqwhh7vryq.appsync-api.us-east-2.amazonaws.com',
    },
    region: region,
    service: 'appsync',
    body: JSON.stringify({
      query: updateAppDataMutation,
      operationName: 'UpdateAppData',
      variables: {
        input: newData,
      },
    }),
  };

  // sign the headers
  aws4.sign(opts2);
  // send rquest to graphql endpoint
  try {
    const saved = await saveEnroll(opts2);
    return { status: 'success', data: saved };
  } catch (err) {
    return { status: 'failed', data: null, error: `failed during save=${err}` };
  }
};

/**
 * Takes the aws4 signed options and sends the request to get the lastest db data
 *  -- TODO couldn't get to work with Axios...needs more work
 * @param opts
 * @returns
 */
export const syncEnroll = async (opts: any, data: any) => {
  try {
    const headers = aws4.sign(opts).headers;
    console.log('headers', headers);
    const resp = await axios({
      url: appsyncUrl,
      method: 'post',
      headers: headers,
      data: data,
    });
    console.log('resp', resp);
    return resp.data;
  } catch (err) {
    throw `Error: ${err}`;
  }
};

/**
 * Takes the aws4 signed options and sends the rquest to save the updated data
 *  -- TODO couldn't get to work with Axios...needs more work
 * @param opts
 * @returns
 */
export const saveEnroll = async (opts: any) => {
  try {
    const resp = await new Promise((resolve, reject) => {
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
    return { ...resp['data'] };
  } catch (err) {
    throw `Error: ${err}`;
  }
};

/**
 * Takes the ServiceProduct
 * @param prodResponse
 * @returns
 */
const mapData = (
  prodResponse: IEnrollServiceProductResponse[] | IEnrollServiceProductResponse,
): {
  enrollReport: IEnrollServiceProductResponse | undefined;
  enrollMergeReport: IEnrollServiceProductResponse | undefined;
  enrollVantageScore: IEnrollServiceProductResponse | undefined;
} => {
  let enrollReport;
  let enrollMergeReport;
  let enrollVantageScore;
  if (prodResponse instanceof Array) {
    enrollReport = prodResponse.find((item: IEnrollServiceProductResponse) => {
      return item['a:ServiceProduct'] === 'TUCReport';
    });
    enrollMergeReport = prodResponse.find((item: IEnrollServiceProductResponse) => {
      return item['a:ServiceProduct'] === 'MergeCreditReports';
    });
    enrollVantageScore = prodResponse.find((item: IEnrollServiceProductResponse) => {
      return item['a:ServiceProduct'] === 'TUCVantageScore3';
    });
  } else {
    switch (prodResponse['a:ServiceProduct']) {
      case 'TUCReport':
        enrollReport = prodResponse['a:ServiceProduct'] || null;
        break;
      case 'MergeCreditReports':
        enrollMergeReport = prodResponse['a:ServiceProduct'] || null;
        break;
      case 'TUCVantageScore3':
        enrollVantageScore = prodResponse['a:ServiceProduct'] || null;
        break;
      default:
        break;
    }
  }
  return {
    enrollReport,
    enrollMergeReport,
    enrollVantageScore,
  };
};
