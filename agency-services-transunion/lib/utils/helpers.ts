import { IRequestOptions } from 'lib/interfaces/api.interfaces';
import * as https from 'https';

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

export const nilConstructor = () => {
  return {
    _attributes: {
      'xsi:nil': 'true',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    },
  };
};

export const textConstructor = (text: string, nullable: boolean = false) => {
  if (!text && nullable) {
    return nilConstructor();
  } else {
    return {
      _text: text || '',
    };
  }
};

export const cdataConstructor = (text: string, nullable: boolean = false) => {
  if (!text && nullable) {
    return nilConstructor();
  } else {
    return {
      _text: `<![CDATA[${text}]]>`,
    };
  }
};
