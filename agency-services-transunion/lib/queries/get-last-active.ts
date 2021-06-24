import gql from 'graphql-tag';
import { print } from 'graphql';
import { getLastActiveOnboardingQuery } from 'lib/queries/custom-queries.ts';
import { postCustomQuery } from 'lib/utils/helpers';

const region = process.env.AWS_REGION;

/**
 * Takes the enroll response and saves it to the database
 * @returns
 */
export const getLastActiveOnboarding = async (id: string): Promise<{ status: string; data: any; error?: string }> => {
  let payload1 = {
    query: print(gql(getLastActiveOnboardingQuery)),
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

  try {
    const response = await postCustomQuery(opts1, payload1);
    return { status: 'success', data: response, error: null };
  } catch (err) {
    return { status: 'failed', data: null, error: `failed during sync=${err}` };
  }
};
