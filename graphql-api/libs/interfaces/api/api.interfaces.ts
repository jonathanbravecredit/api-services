import { Method } from 'axios';
import * as https from 'https';

export interface PostAPIBody {
  email: string;
}

export interface IRequestOptions {
  url: string;
  method: Method;
  data: string;
  httpsAgent: https.Agent;
  headers: {
    'Accept-Encoding': string;
    'Content-Type': string;
    SOAPAction: string;
    Authorization: string;
    'Content-Length': number;
    Host: string;
    Connection: string;
    'User-Agent': string;
  };
}

export interface IGenericRequest {
  id: string;
}

export interface IGenericBundleRequest {
  id: string;
  serviceBundleCode: string;
}

export interface IJwks {
  keys: IKey[];
}

export interface IKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

export interface IAccessToken {
  sub: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
  client_id: string;
  username: string;
}
