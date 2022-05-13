import { textConstructor } from 'libs/utils/helpers/helpers';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import {
  IGetServiceProduct,
  IGetServiceProductMsg,
} from 'libs/transunion/service-product/get-service-product.interface';

/**
 * This method packages the message in a request body and adds account information
 * @param {string} accountCode Brave TU account code (can be overriden if passed as part of message)
 * @param {string} accountName Brave TU account name (can be overriden if passed as part of message)
 * @param {IGetServiceProductMsg} msg
 * @returns
 */
export const formatGetServiceProduct = (
  accountCode: string,
  accountName: string,
  msg: string,
): IGetServiceProduct | undefined => {
  let message: IGetServiceProductMsg = JSON.parse(msg);
  return message
    ? {
        request: {
          AccountCode: message.AccountCode || accountCode,
          AccountName: message.AccountName || accountName,
          ...message,
        },
      }
    : undefined;
};

/**
 * This method transforms the JSON message to the XML request
 * @param {IGetServiceProduct} msg The packaged message to send in XML format to TU
 * @returns
 */
export const createGetServiceProduct = (msg: IGetServiceProduct): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
        'xmlns:arr': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:GetServiceProduct': {
          'con:request': {
            'data:AccountCode': textConstructor(msg.request.AccountCode),
            'data:AccountName': textConstructor(msg.request.AccountName),
            'data:RequestKey': textConstructor(`BC-${uuid.v4()}`),
            'data:ClientKey': textConstructor(msg.request.ClientKey),
            'data:CSRFToken': textConstructor(msg.request.CSRFToken, true),
            'data:ClientBrowserType': textConstructor(msg.request.ClientBrowserType, true),
            'data:IpAddress': textConstructor(msg.request.IpAddress, true),
            'data:ProductDisplay': textConstructor(msg.request.ProductDisplay),
            'data:ServiceBundleFulfillmentKey': textConstructor(msg.request.SeviceBundleFulfillmentKey),
          },
        },
      },
    },
  };
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};
