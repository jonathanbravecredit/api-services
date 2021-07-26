import axios, { AxiosResponse } from 'axios';
import * as aws4 from 'aws4';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { IEnrollServiceProductResponse, IGetAppDataRequest } from 'lib/interfaces';
import { getAppData, updateAppData } from 'lib/proxy';
import { returnNestedObject, cleanBackendData, deleteKeyNestedObject } from 'lib/utils';
import { GetAppDataQuery, TUReportResponseInput, UpdateAppDataInput } from 'src/api/api.service';

const appsyncUrl = process.env.APPSYNC_ENDPOINT;
const region = process.env.AWS_REGION;

export class Sync {
  enricher: (prior: any, updated: any, dispute: boolean) => UpdateAppDataInput;
  constructor(enricher: (prior: any, updated: any, dispute: boolean) => UpdateAppDataInput) {
    this.enricher = enricher;
  }

  async syncData(variables: IGetAppDataRequest, updated: any, dispute: boolean = false): Promise<boolean> {
    try {
      const resp = await getAppData(variables);
      const app: GetAppDataQuery = returnNestedObject(resp.data, 'getAppData');
      const clean: UpdateAppDataInput = this.cleanBackendData(app);
      const enriched: UpdateAppDataInput | undefined = this.enricher(clean, updated, dispute);
      if (enriched === undefined) return false;
      const sync = await updateAppData({ input: enriched });
      return true;
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
    let payload = {
      query: print(gql(query)),
      variables: variables,
    };
    let opts = {
      method: 'POST',
      host: '24ga46y3gbgodogktqwhh7vryq.appsync-api.us-east-2.amazonaws.com',
      region: region,
      path: 'graphql',
      body: JSON.stringify(payload),
      service: 'appsync',
    };

    try {
      const headers = aws4.sign(opts).headers;
      const resp: AxiosResponse<any> = await axios({
        url: appsyncUrl,
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
    let clean = deleteKeyNestedObject(data, '__typename');
    delete clean.createdAt; // this is a graphql managed field
    delete clean.updatedAt; // this is a graphql managed field
    delete clean.owner; // this is a graphql managed field
    return clean;
  }
}
