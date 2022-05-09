import axios, { AxiosResponse } from 'axios';
import * as aws4 from 'aws4';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { GetAppDataQuery, TUReportResponseInput, UpdateAppDataInput } from 'src/api/api.service';
import { IGetAppDataRequest, IGetAppDataResponse } from 'libs/interfaces/transunion/get-app-data.interface';
import { getAppData, updateAppData } from 'libs/queries/graphql-query-methods';
import { IEnrollServiceProductResponse } from 'libs/transunion/enroll/enroll.interface';
import { Nested as _nest } from '@bravecredit/brave-sdk';

const appsyncUrl = process.env.APPSYNC_ENDPOINT;
const region = process.env.AWS_REGION;

export class Sync {
  enricher: (prior: any, updated: any, dispute: boolean) => UpdateAppDataInput;
  constructor(enricher: (prior: any, updated: any, dispute: boolean) => UpdateAppDataInput) {
    this.enricher = enricher;
  }

  async syncData(variables: IGetAppDataRequest, updated: any, dispute: boolean = false): Promise<boolean> {
    try {
      const app = await getAppData(variables);
      const appData: IGetAppDataResponse = app.data;
      if (appData?.errors?.length > 0) return false; // gql error;
      const clean = this.cleanBackendData(appData.data.getAppData);
      const enriched = this.enricher(clean, updated, dispute);
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

  // TODO use a pascal to camel converter
  mapReportResponse(res: IEnrollServiceProductResponse | undefined): TUReportResponseInput | null {
    if (res === undefined) return null;
    return {
      bureau: res['Bureau'],
      errorResponse: res['ErrorResponse']['Code'] || res['ErrorResponse']['nil'],
      serviceProduct: res['ServiceProduct'],
      serviceProductFullfillmentKey: res['ServiceProductFulfillmentKey'],
      serviceProductObject: JSON.stringify(res['ServiceProductObject']),
      serviceProductTypeId: res['ServiceProductTypeId'],
      serviceProductValue: res['ServiceProductValue'],
      status: res['Status'],
    };
  }

  cleanBackendData(data: GetAppDataQuery): UpdateAppDataInput {
    let clean = _nest.delete(data, '__typename');
    delete clean.createdAt; // this is a graphql managed field
    delete clean.updatedAt; // this is a graphql managed field
    delete clean.owner; // this is a graphql managed field
    return clean;
  }
}
