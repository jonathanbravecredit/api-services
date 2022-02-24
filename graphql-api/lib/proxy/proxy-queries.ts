import { AxiosResponse } from 'axios';
import {
  IGetAppDataRequest,
  IGetDataForGetDisputeStatus,
  IGetDisputeRequest,
  IProxyQueryGetAppData,
} from 'lib/interfaces';
import * as qry from 'lib/queries';
import { postGraphQLRequest } from 'lib/utils/helpers/helpers';
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

export const getCancelEnrollment = async (msg: IGetAppDataRequest): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(qry.qryGetCancelEnrollment, msg);
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
    return await postGraphQLRequest(qry.qryGetDataForFulfill, msg);
  } catch (err) {
    return err;
  }
};

export const getDataForGetDisputeStatus = async (
  msg: IGetAppDataRequest,
): Promise<AxiosResponse<IProxyQueryGetAppData<IGetDataForGetDisputeStatus>>> => {
  try {
    return await postGraphQLRequest(qry.qryGetDataForGetDisputeStatus, msg);
  } catch (err) {
    return err;
  }
};

export const getDataForGetDisputeHistory = async (msg: IGetAppDataRequest): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(qry.qryGetDataForGetDisputeHistory, msg);
  } catch (err) {
    return err;
  }
};

export const getDataForGetInvestigationResults = async (msg: IGetAppDataRequest): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(qry.qryGetDataForGetInvestigationResults, msg);
  } catch (err) {
    return err;
  }
};

export const getDataForStartDispute = async (msg: IGetAppDataRequest): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(qry.qryGetDataForStartDisputes, msg);
  } catch (err) {
    return err;
  }
};

export const getDispute = async (msg: IGetDisputeRequest): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(qry.qryGetDispute, msg);
  } catch (err) {
    return err;
  }
};

export const listCreditScores = async (limit: number): Promise<AxiosResponse<any>> => {
  try {
    return await postGraphQLRequest(qry.listVantageScores, { limit: limit });
  } catch (err) {
    return err;
  }
};
