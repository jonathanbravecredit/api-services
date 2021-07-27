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