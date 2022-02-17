import * as aws4 from 'aws4';
import gql from 'graphql-tag';
import axios, { AxiosResponse } from 'axios';
import { print } from 'graphql';

export interface IGraphQL {
  aphostsyncUrl: string;
  region: string;
  payload: string;
  gql: any;
  print: any;
  options: IOptions;
}
interface IOptions {
  method: string;
  host: string;
  region: string;
  path: string;
  body: string;
  service: string;
}

interface IPayload {
  query: string;
  variables: any;
}

export class GraphQL {
  host = process.env.APPSYNC_ENDPOINT;
  region = process.env.AWS_REGION;
  query: string;
  variables: any;
  options: IOptions;
  payload: IPayload;
  constructor(query: string, variables: any) {
    this.query = query;
    this.variables = variables;
    this.createPayload();
    this.createOptions();
  }

  createPayload() {
    this.payload = {
      query: print(gql(this.query)),
      variables: this.variables,
    };
  }

  createOptions() {
    this.options = {
      method: 'POST',
      host: this.host,
      region: this.region,
      path: 'graphql',
      body: JSON.stringify(this.payload),
      service: 'appsync',
    };
  }

  async postGraphQLRequest<T>(): Promise<AxiosResponse<T>> {
    try {
      const headers = aws4.sign(this.options).headers;
      const resp: AxiosResponse<T> = await axios({
        url: `https://${this.host}/graphql`,
        method: 'post',
        headers: headers,
        data: this.payload,
      });
      return resp;
    } catch (err) {
      console.log('postGraphQLRequest:error ===> ', err);
      return err;
    }
  }
}
