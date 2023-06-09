import * as aws4 from 'aws4';
import gql from 'graphql-tag';
import { print } from 'graphql';
import axios, { AxiosResponse } from 'axios';
import { TUReportResponseInput } from 'src/api/api.service';
import { IEnrollServiceProductResponse } from 'libs/transunion/enroll/enroll.interface';
import { IFulfillServiceProductResponse } from 'libs/transunion/fulfill/fulfill.interface';
// 2021-11-17T20:58:12.439Z
const appsyncUrl = process.env.APPSYNC_ENDPOINT;
const region = process.env.AWS_REGION;

export const postGraphQLRequest = async (query: string, variables: any): Promise<AxiosResponse<any>> => {
  let payload = {
    query: print(gql(query)),
    variables,
  };
  // create the options for the sync up
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
export const returnNestedObject = <T>(o: any, k: string): T => {
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
export const mapReportResponse = (
  res: IEnrollServiceProductResponse | IFulfillServiceProductResponse | undefined,
): TUReportResponseInput | null => {
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

// IMPORTANT!!! DO NOT STRINGIFY THE serviceProductObject
// GraphQL schema has this as a type of AWSJSON, which converts on write to AWS MAP and back to STRING on read
//    Good: saving through GQL:
//        - JSON String > GQL(write/converts to map) > Dynamo (saved as map) > GQL(read/converts to string) > JSON String
//    Bad: saving through DynamoDB query:
//        - JSON string > dynamo DB (write/saves as string) > GQL (read/converts to string) > double JSON String (bad!!!)
export const mapReportResponseWorker = (
  res: IEnrollServiceProductResponse | IFulfillServiceProductResponse | undefined,
): TUReportResponseInput | null => {
  if (res === undefined) return null;
  return {
    bureau: res['Bureau'],
    errorResponse: res['ErrorResponse']['Code'] || res['ErrorResponse']['nil'],
    serviceProduct: res['ServiceProduct'],
    serviceProductFullfillmentKey: res['ServiceProductFulfillmentKey'],
    serviceProductObject: res['ServiceProductObject'],
    serviceProductTypeId: res['ServiceProductTypeId'],
    serviceProductValue: res['ServiceProductValue'],
    status: res['Status'],
  };
};
