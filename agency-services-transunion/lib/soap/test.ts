import { AxiosResponse } from 'axios';
import { IGetAppDataRequest } from 'lib/interfaces/get-app-data.interface';
import { getLastActiveOnboardingQuery } from 'lib/queries';
import { postGraphQLRequest } from 'lib/utils/helpers';

export const getAppData = async (msg: IGetAppDataRequest): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(getLastActiveOnboardingQuery, msg);
  } catch (err) {
    return err;
  }
};
