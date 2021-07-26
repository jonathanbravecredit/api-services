import { GetAppDataQuery } from 'src/api/api.service';

export interface IGetAppDataRequest {
  id: string;
}

export interface IGetAppDataResponse {
  data: {
    getAppData: GetAppDataQuery;
  } | null;
  errors?: any[];
}
