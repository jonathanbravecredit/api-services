/* eslint-disable no-console */
require('es6-promise').polyfill();
require('isomorphic-fetch');
import { config } from 'aws-sdk';
import AWSAppSyncClient, { AUTH_TYPE, AWSAppSyncClientOptions } from 'aws-appsync';
import gql from 'graphql-tag';
import { AppSyncResolverEvent } from 'aws-lambda';

const con: AWSAppSyncClientOptions = {
  url: process.env.APPSYNC_ENDPOINT,
  region: process.env.AWS_REGION,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: config.credentials,
  },
  disableOffline: true,
};
const client = new AWSAppSyncClient(con);
console.log('client', client);

const pingTuQuery = `query GetAppData($id: ID!) {
  getAppData(id: $id) {
    __typename
    id
    user {
      __typename
      id
      userAttributes {
        __typename
        name {
          __typename
          first
          middle
          last
        }
        address {
          __typename
          addressOne
          addressTwo
          city
          state
          zip
        }
        phone {
          __typename
          primary
        }
        dob {
          __typename
          year
          month
          day
        }
        ssn {
          __typename
          lastfour
          full
        }
      }
      onboarding {
        __typename
        lastActive
        lastComplete
        started
      }
    }
    agencies {
      __typename
      transunion {
        __typename
        authenticated
        indicativeEnrichmentSuccess
        getAuthenticationQuestionsSuccess
        serviceBundleFulfillmentKey
        currentRawQuestions
        currentRawAuthDetails
        enrollmentKey
        enrollReport {
          __typename
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
          __typename
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
          __typename
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        hidePositiveCreditCardAccounts
        hidePositiveCollectionAccounts
        hidePositiveInstallmentAccounts
        hidePositiveMortgageAccounts
      }
      equifax {
        __typename
        authenticated
      }
      experian {
        __typename
        authenticated
      }
    }
    preferences {
      __typename
      showAllAccounts {
        __typename
        creditCards
        collectionsAccounts
        installmentLoans
        mortgages
      }
    }
    createdAt
    updatedAt
    owner
  }
}`;

export const getAppData = async (id: string): Promise<unknown> => {
  try {
    const result = await client.query({
      query: gql(pingTuQuery),
      variables: { id },
      fetchPolicy: 'network-only',
    });
    return result;
  } catch (err) {
    console.log('Error sending query: ', err);
    return err;
  }
};

export const main: any = async (event: AppSyncResolverEvent<any>): Promise<any> => {
  try {
    const results = await getAppData('us-east-2:f1708371-02f4-4853-bb7e-d446678297bc');
    console.log(results);
    return results;
  } catch (err) {
    console.log('Error ====> ', err);
    return;
  }
};
