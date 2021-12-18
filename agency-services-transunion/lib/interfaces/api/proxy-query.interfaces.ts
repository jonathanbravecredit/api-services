import * as https from 'https';

export interface IProxyQueryGetAppData<T> {
  data: {
    getAppData: T;
  };
}

export interface IProxyRequest {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}
