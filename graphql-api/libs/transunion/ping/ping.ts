import * as convert from 'xml-js';
import * as https from 'https';
import * as fastXml from 'fast-xml-parser';
import * as interfaces from 'libs/interfaces';
import * as tu from 'libs/transunion';
import * as he from 'he';
import { SoapAid } from 'libs/utils/soap-aid/soap-aid';
import ErrorLogger from 'libs/utils/db/logger/logger-errors';
import TransactionLogger from 'libs/utils/db/logger/logger-transactions';

const errorLogger = new ErrorLogger();
const transactionLogger = new TransactionLogger();
const parserOptions = {
  attributeNamePrefix: '',
  ignoreAttributes: false,
  ignoreNameSpace: true,
  parseAttributeValue: true,
  attrValueProcessor: (val, attrName) => he.encode(val, { isAttributeValue: true }), //default is a=>a
  tagValueProcessor: (val, tagName) => he.encode(val), //default is a=>a
};

export const createPing = (): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:Ping': '',
      },
    },
  };
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};

/**
 * Simple method to ping TU services and ensure a successful response
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const Ping = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error?: interfaces.IErrorResponse | interfaces.INil | string;
  data?: any;
}> => {
  const soap = new SoapAid(fastXml.parse, () => {}, tu.createPing);
  try {
    const { xml } = soap.createPackage(null, null, null);
    const request = soap.createRequestPayload(agent, auth, xml, 'Ping');
    if (!xml || !request) throw new Error(`Missing xml:${xml}, or request:${request}`);
    await soap.processRequest(request, parserOptions);
    const response = { success: true, error: null, data: 'Ping succeeded' };
    const l1 = transactionLogger.createTransaction(identityId, 'Ping', JSON.stringify(response));
    await transactionLogger.logger.create(l1);
    return response;
  } catch (err) {
    const error = errorLogger.createError(identityId, 'Ping', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err };
  }
};
