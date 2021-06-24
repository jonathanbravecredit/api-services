import gql from 'graphql-tag';
import { print } from 'graphql';
import { getUserLastActive } from 'lib/queries/custom-queries.ts';
import { postCustomQuery } from 'lib/utils/helpers';

const region = process.env.AWS_REGION;

/**
 * Takes the enroll response and saves it to the database
 * @returns
 */
export const getLastActive = async (): Promise<{ status: string; data: any; error?: string }> => {
  let payload1 = {
    query: print(gql(getUserLastActive)),
    variables: {
      id: 'us-east-2:f1708371-02f4-4853-bb7e-d446678297bc',
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
    console.log('ping', JSON.stringify(response));
    return { status: 'success', data: response, error: null };
  } catch (err) {
    return { status: 'failed', data: null, error: `failed during sync=${err}` };
  }
};
