import { returnNestedObject, textConstructor, updateNestedObject } from 'lib/utils/helpers';
import * as convert from 'xml-js';
import * as fastXml from 'fast-xml-parser';
import * as uuid from 'uuid';
import { IEnroll, IEnrollMsg, IEnrollResponse } from 'lib/interfaces/enroll.interface';
import * as isomorphicFetch from 'isomorphic-fetch';
// const AWS = require('aws-sdk/global');
import * as AWS from 'aws-sdk';
import * as APPSYNC from 'aws-appsync';
import gql from 'graphql-tag';
import { AWSAppSyncClientOptions } from 'aws-appsync';
import { UpdateAppDataInput } from 'lib/queries/api.service';

const AUTH_TYPE = APPSYNC.AUTH_TYPE;
const AWSAppSyncClient = APPSYNC.default;

const config: AWSAppSyncClientOptions = {
  url: process.env.APPSYNC_ENDPOINT,
  region: process.env.AWS_REGION,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: AWS.config.credentials,
  },
  disableOffline: true,
};
const client = new AWSAppSyncClient(config);

const getAppDataQuery = `
query GetAppData($id: ID!) {
  getAppData(id: $id) {
    id
    user {
      id
      userAttributes {
        name {
          first
          middle
          last
        }
        address {
          addressOne
          addressTwo
          city
          state
          zip
        }
        phone {
          primary
        }
        dob {
          year
          month
          day
        }
        ssn {
          lastfour
          full
        }
      }
      onboarding {
        lastActive
        lastComplete
        started
      }
    }
    agencies {
      transunion {
        authenticated
        indicativeEnrichmentSuccess
        getAuthenticationQuestionsSuccess
        serviceBundleFulfillmentKey
        currentRawQuestions
        currentRawAuthDetails
        enrollmentKey
        enrollReport {
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        enrollMergeReport {
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        enrollVantageScore {
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
      }
      equifax {
        authenticated
      }
      experian {
        authenticated
      }
    }
    createdAt
    updatedAt
    owner
  }
}
`;

const updateAppDataMutation = `mutation UpdateAppData($input: UpdateAppDataInput!) {
  updateAppData(input: $input) {
  }
}`;

export const getAppData = async (id: string): Promise<unknown> => {
  try {
    const result = await client.query({
      query: gql(getAppDataQuery),
      variables: { id },
      fetchPolicy: 'network-only',
    });
    return result;
  } catch (err) {
    console.log('Error sending query: ', err);
    return err;
  }
};

export const updateAppData = async (data: UpdateAppDataInput): Promise<unknown> => {
  try {
    const result = await client.mutate({
      mutation: gql(updateAppDataMutation),
      variables: { input: data },
      fetchPolicy: 'network-only',
    });
    return result;
  } catch (err) {
    console.log('Error sending mutation: ', err);
    return err;
  }
};

export const formatEnroll = (accountCode: string, accountName: string, msg: string): IEnroll | undefined => {
  let message: IEnrollMsg = JSON.parse(msg);
  return message
    ? {
        request: {
          AccountCode: accountCode,
          AccountName: accountName,
          ...message,
        },
      }
    : undefined;
};

/**
 * Creates the JSON object the XML parser expects
 * @param {IEnroll} msg
 * @returns
 */
export const createEnroll = (msg: IEnroll): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:Enroll': {
          'con:request': {
            'data:AccountCode': textConstructor(msg.request.AccountCode),
            'data:AccountName': textConstructor(msg.request.AccountName),
            'data:RequestKey': textConstructor(`BC-${uuid.v4()}`),
            'data:ClientKey': textConstructor(msg.request.ClientKey),
            'data:Customer': {
              'data:CurrentAddress': {
                'data:AddressLine1': textConstructor(msg.request.Customer.CurrentAddress.AddressLine1),
                'data:AddressLine2': textConstructor(msg.request.Customer.CurrentAddress.AddressLine2, true),
                'data:City': textConstructor(msg.request.Customer.CurrentAddress.City),
                'data:State': textConstructor(msg.request.Customer.CurrentAddress.State),
                'data:Zipcode': textConstructor(msg.request.Customer.CurrentAddress.Zipcode),
              },
              'data:DateOfBirth': textConstructor(msg.request.Customer.DateOfBirth),
              'data:FullName': {
                'data:FirstName': textConstructor(msg.request.Customer.FullName.FirstName),
                'data:LastName': textConstructor(msg.request.Customer.FullName.LastName),
                'data:MiddleName': textConstructor(msg.request.Customer.FullName.MiddleName, true),
                'data:Prefix': textConstructor(msg.request.Customer.FullName.Prefix, true),
                'data:Suffix': textConstructor(msg.request.Customer.FullName.Suffix, true),
              },
              'data:Ssn': textConstructor(msg.request.Customer.Ssn),
            },
            'data:Email': textConstructor(msg.request.Email, true),
            'data:Language': textConstructor(msg.request.Language, true),
            'data:ServiceBundleCode': textConstructor(msg.request.ServiceBundleCode),
          },
        },
      },
    },
  };
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};

/**
 * Parse the Enroll response including the embedded Service Product Objects
 * @param xml
 * @returns
 */
export const parseEnroll = (xml: string): IEnrollResponse => {
  const obj: IEnrollResponse = returnNestedObject(fastXml.parse(xml), 'EnrollResponse');
  const resp = returnNestedObject(obj, 'a:ServiceProductResponse');
  if (resp instanceof Array) {
    const mapped = resp.map((prod) => {
      let prodObj = prod['a:ServiceProductObject'];
      if (typeof prodObj === 'string') {
        let clean = prodObj.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#xD;/g, '');
        return {
          ...prod,
          'a:ServiceProductObject': fastXml.parse(clean),
        };
      }
    });
    const updated = updateNestedObject(obj, 'a:ServiceProductResponse', [...mapped]);
    return updated ? updated : obj;
  } else {
    return obj;
  }
};

export const syncAndSaveEnroll = async (res: IEnrollResponse): Promise<string> => {
  console.log('res', res);
  if (!res['a:ClientKey']) return JSON.stringify({ Status: 'Failed, no ID returned' });
  const data = await getAppData(res['a:ClientKey']);
  console.log('data back from query', data);
  if (!data) return JSON.stringify({ Status: 'Failed, no data returned from query' });
  return JSON.stringify({ Status: 'Success' });
};
