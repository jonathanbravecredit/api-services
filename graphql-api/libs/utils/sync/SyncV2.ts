import * as aws4 from 'aws4';
import axios, { AxiosResponse } from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { IGetAppDataRequest, IGetAppDataResponse } from 'libs/interfaces';
import { getAppData, updateAppData } from 'libs/proxy';
import { deleteKeyNestedObject } from 'libs/utils';
import { GetAppDataQuery, UpdateAppDataInput } from 'src/api/api.service';

const appsyncUrl = process.env.APPSYNC_ENDPOINT;
const region = process.env.AWS_REGION;

export class SyncV2 {
  public clean: UpdateAppDataInput;
  protected enriched: UpdateAppDataInput;

  constructor() {}

  async getCleanData(variables: IGetAppDataRequest): Promise<void> {
    const app = await getAppData(variables);
    const appData: IGetAppDataResponse = app.data;
    if (appData?.errors?.length > 0) return; // gql error;
    this.clean = this.cleanBackendData(appData.data.getAppData);
  }

  // enrichment data must be fed in by another classes enrichment method
  async syncData(enriched: any): Promise<boolean> {
    try {
      if (enriched === undefined) return false; // enrichment error
      const sync = await updateAppData({ input: enriched });
      const syncData: IGetAppDataResponse = sync.data; // gql error
      if (syncData?.errors?.length > 0) throw syncData?.errors;
      return syncData?.errors?.length > 0 ? false : true;
    } catch (err) {
      console.log('syncData:err ===> ', err);
      return false;
    }
  }

  /**
   * Processes generic graphql requests
   * @param {string} query
   * @param {any} variables
   * @returns axios response
   */
  async postGraphQLRequest(query: string, variables: any): Promise<AxiosResponse<any>> {
    console.log('url ===> ', appsyncUrl);
    let payload = {
      query: print(gql(query)),
      variables,
    };
    let opts = {
      method: 'POST',
      host: appsyncUrl,
      region: region,
      path: 'graphql',
      body: JSON.stringify(payload),
      service: 'appsync',
    };

    try {
      const headers = aws4.sign(opts).headers;
      const resp: AxiosResponse<any> = await axios({
        url: `https://${appsyncUrl}/graphql`,
        method: 'post',
        headers: headers,
        data: payload,
      });
      return resp;
    } catch (err) {
      console.log('postGraphQLRequest:error ===> ', err);
      return err;
    }
  }

  cleanBackendData(data: GetAppDataQuery): UpdateAppDataInput {
    let clean = deleteKeyNestedObject(data, '__typename');
    clean = deleteKeyNestedObject(data, 'isFresh');
    delete clean.createdAt; // this is a graphql managed field
    delete clean.updatedAt; // this is a graphql managed field
    delete clean.owner; // this is a graphql managed field
    return clean;
  }
}
