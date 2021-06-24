import { IRequestOptions } from 'lib/interfaces/api.interfaces';
import * as https from 'https';
import * as aws4 from 'aws4';
import axios from 'axios';

const appsyncUrl = process.env.APPSYNC_ENDPOINT;

/**
 * Takes the aws4 signed options and sends the request to get the lastest db data
 *  -- TODO couldn't get to work with Axios...needs more work
 * @param opts
 * @returns
 */
export const postCustomQuery = async (opts: any, data: any) => {
  try {
    const headers = aws4.sign(opts).headers;
    console.log('headers', headers);
    const resp = await axios({
      url: appsyncUrl,
      method: 'post',
      headers: headers,
      data: data,
    });
    console.log('resp', resp);
    return resp.data;
  } catch (err) {
    throw `Error: ${err}`;
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
