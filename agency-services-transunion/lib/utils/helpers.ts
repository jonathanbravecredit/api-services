import { IRequestOptions } from 'lib/interfaces/api.interfaces';
import * as https from 'https';
import * as aws4 from 'aws4';
import * as fastXml from 'fast-xml-parser';
import axios, { AxiosResponse } from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { IGetAppDataRequest } from 'lib/interfaces/get-app-data.interface';
import { GetAppDataQuery, TUReportResponseInput, UpdateAppDataInput } from 'src/api/api.service';
import { getAppData, updateAppData } from 'lib/queries/proxy-queries';
import { IEnrollServiceProductResponse } from 'lib/interfaces/enroll.interface';
import { IGetDisputeRequest } from 'lib/interfaces/get-dispute-data-interface';

const appsyncUrl = process.env.APPSYNC_ENDPOINT;
const region = process.env.AWS_REGION;

/**
 * Generic method to create package to send to TU
 * - uses callbacks to create message and xml messages
 * @param code
 * @param username
 * @param message
 * @param cbMsg
 * @param cbXml
 * @returns
 */
export const createPackage = (
  code: string,
  username: string,
  message: string,
  cbMsg: (code: string, username: string, message: string) => void,
  cbXml: (msg: any) => void,
): { msg: any; xml: any } => {
  const msg = cbMsg(code, username, message);
  console.log('createPackage:msg ===> ', JSON.stringify(msg));
  const xml = cbXml(msg);
  console.log('createPackage:xml ===> ', xml);
  return {
    msg,
    xml,
  };
};

/**
 * Generic method to take the prior data, enrich it using a passed enricher
 *   and to update the database with the new enriched data.
 * @param variables
 * @param prior
 * @param curr
 * @param cbEnricher
 * @returns
 */
export const syncData = async (
  variables: IGetAppDataRequest,
  updated: any,
  cbEnricher: (prior: any, updated: any, dispute: boolean) => UpdateAppDataInput,
  dispute: boolean = false,
): Promise<boolean> => {
  try {
    const resp = await getAppData(variables);
    const app: GetAppDataQuery = returnNestedObject(resp.data, 'getAppData');
    const clean: UpdateAppDataInput = cleanBackendData(app);
    const enriched: UpdateAppDataInput = cbEnricher(clean, updated, dispute);
    const sync = await updateAppData({ input: enriched });
    return true;
  } catch (err) {
    console.log('syncData:err ===> ', err);
    return false;
  }
};

/**
 * Generic method to process the axios request to send to TU
 * - uses the parser provided to process return message
 * @param options
 * @param parser
 * @param parserOptions
 * @returns parsed and stringified data
 */
export const processRequest = async (
  options: IRequestOptions,
  parser: (
    xmlData: string,
    options?: Partial<fastXml.X2jOptions>,
    validationOptions?: boolean | Partial<fastXml.validationOptions>,
  ) => void,
  parserOptions: Partial<fastXml.X2jOptions>,
) => {
  try {
    const res = await axios({ ...options });
    const results = parser(res.data, parserOptions);
    return results;
  } catch (err) {
    console.log('processRequest:err ===> ', err);
    return err;
  }
};

/**
 * Generic method to process the axios request to send to TU
 * - uses the parser provided to process return message
 * @param options
 * @param parser
 * @param parserOptions
 * @returns parsed and stringified data
 */
export const processMockRequest = async (
  mock: string,
  options: IRequestOptions,
  parser: (
    xmlData: string,
    options?: Partial<fastXml.X2jOptions>,
    validationOptions?: boolean | Partial<fastXml.validationOptions>,
  ) => void,
  parserOptions: Partial<fastXml.X2jOptions>,
) => {
  try {
    const results = parser(mock, parserOptions);
    return results;
  } catch (err) {
    console.log('processRequest:err ===> ', err);
    return err;
  }
};
/**
 * Processes generic graphql requests
 * @param {string} query
 * @param {any} variables
 * @returns axios response
 */
export const postGraphQLRequest = async (query: string, variables: any): Promise<AxiosResponse<any>> => {
  let payload = {
    query: print(gql(query)),
    variables: variables,
  };
  // create the options for the sync up
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
};

/**
 * This method creates the https agent needed to make the SOAP calls
 * @param httpsAgent
 * @param auth
 * @param data
 * @param SOAPAction
 * @returns
 */
export const createRequestOptions = (
  httpsAgent: https.Agent,
  auth: string,
  data: string,
  SOAPAction: string,
): IRequestOptions => {
  return {
    url: 'https://cc2ws-live.sd.demo.truelink.com/wcf/CC2.svc',
    method: 'POST',
    data: data,
    httpsAgent,
    headers: {
      'Accept-Encoding': 'gzip,deflate',
      'Content-Type': 'text/xml;charset=UTF-8',
      SOAPAction: `https://consumerconnectws.tui.transunion.com/ICC2/${SOAPAction}`,
      Authorization: auth,
      'Content-Length': data.length,
      Host: 'cc2ws-live.sd.demo.truelink.com',
      Connection: 'Keep-Alive',
      'User-Agent': 'Apache-HttpClient/4.5.2 (Java/1.8.0_181)',
    },
  };
};

/**
 * Removes the '__typename' fields from query results
 * @param data
 * @returns
 */
export const cleanBackendData = (data: GetAppDataQuery): UpdateAppDataInput => {
  let clean = deleteKeyNestedObject(data, '__typename');
  delete clean.createdAt; // this is a graphql managed field
  delete clean.updatedAt; // this is a graphql managed field
  delete clean.owner; // this is a graphql managed field
  return clean;
};

/**
 * This will create an object/XML record for null records to feed to the parser
 * @returns
 */
export const nilConstructor = () => {
  return {
    _attributes: {
      'xsi:nil': 'true',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    },
  };
};

/**
 * This will create an object/XML record for text records to feed to the parser
 * @param text
 * @param nullable
 * @returns
 */
export const textConstructor = (text: string, nullable: boolean = false) => {
  if (!text && nullable) {
    return nilConstructor();
  } else {
    return {
      _text: text || '',
    };
  }
};

/**
 * This will create an CDATA string to inject into an XML component
 * @param text
 * @param nullable
 * @returns
 */
export const cdataConstructor = (text: string, nullable: boolean = false) => {
  if (!text && nullable) {
    return nilConstructor();
  } else {
    return {
      _text: `<![CDATA[${text}]]>`,
    };
  }
};

/**
 * A utility function to update deep nested objects
 * Will update all keys of the name you specify
 * @param {object} o the object you want to transform
 * @param {string} k the key you want to update (updates all of same name)
 * @param {any} v the value you want to update it to
 */
export const updateNestedObject = (o: any, k: string, v: any): any => {
  const obj = Object.assign({}, o);
  _updateNestedRecurse(obj, k, v);
  return obj;
};
const _updateNestedRecurse = (o: any, k: string, v: any) => {
  if (!o) return;
  Object.keys(o).forEach((key) => {
    if (key == k) o[k] = v;
    if (typeof o[key] === 'object') {
      _updateNestedRecurse(o[key], k, v);
    }
  });
};

/**
 * A utility function to remove unwanted fields by key
 * Will delete all keys of the name you specify
 * @param o
 * @param k
 * @returns
 */
export const deleteKeyNestedObject = (o: any, k: string) => {
  const obj = Object.assign({}, o);
  _deleteKeyNestedObject(obj, k);
  return obj;
};
const _deleteKeyNestedObject = (o: any, k: string) => {
  if (!o) return;
  delete o[k];
  Object.keys(o).forEach((key) => {
    if (typeof o[key] === 'object') {
      _deleteKeyNestedObject(o[key], k);
    }
  });
};

/**
 * A utility function to find the first (non-undefined) matching key in a nested object
 *   use carefully. Does not iterate over arrays
 * @param {object} o the object you want to search
 * @param {string} k the key you want to search for
 */
export const returnNestedObject = (o: any, k: string): any => {
  let value;
  const _returnNestedObject = (obj: any) => {
    Object.keys(obj).forEach((key) => {
      if (key === k && value === undefined) value = obj[k];
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        _returnNestedObject(obj[key]);
      }
    });
  };
  _returnNestedObject(o);
  return value;
};

// TODO use a pascal to camel converter
export const mapReportResponse = (res: IEnrollServiceProductResponse | undefined): TUReportResponseInput | null => {
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
};
