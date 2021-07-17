import { AxiosResponse } from 'axios';
import { IGetAppDataRequest } from 'lib/interfaces/get-app-data.interface';
import * as qry from 'lib/queries';
import { postGraphQLRequest } from 'lib/utils/helpers';
import { UpdateAppDataInput } from 'src/api/api.service';

export const getAppData = async (msg: IGetAppDataRequest): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(qry.qryGetAppData, msg);
  } catch (err) {
    return err;
  }
};

export const updateAppData = async (msg: { input: UpdateAppDataInput }): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(qry.qryUpdateAppData, msg);
  } catch (err) {
    return err;
  }
};

export const getEnrollment = async (msg: IGetAppDataRequest): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(qry.qryGetEnrollment, msg);
  } catch (err) {
    return err;
  }
};

export const getDisputeEnrollment = async (msg: IGetAppDataRequest): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(qry.qryGetDisputeEnrollment, msg);
  } catch (err) {
    return err;
  }
};

export const getFulfilledOn = async (msg: IGetAppDataRequest): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(qry.qryGetFulfilledOn, msg);
  } catch (err) {
    return err;
  }
};

export const getDataForEnrollment = async (msg: IGetAppDataRequest): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(qry.qryGetDataForEnrollment, msg);
  } catch (err) {
    return err;
  }
};

export const getDataForFulfill = async (msg: IGetAppDataRequest): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(qry.qryGetDataForEnrollment, msg);
  } catch (err) {
    return err;
  }
};
