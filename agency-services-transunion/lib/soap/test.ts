import { AxiosResponse } from 'axios';
import { getLastActiveOnboardingQuery } from 'lib/queries';
import { postGraphQLRequest } from 'lib/utils/helpers';

export const getAppData = async (msg: any): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(getLastActiveOnboardingQuery, msg);
  } catch (err) {
    return err;
  }
};
