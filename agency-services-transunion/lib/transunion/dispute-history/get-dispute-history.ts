import { textConstructor } from 'lib/utils/helpers/helpers';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import {
  IGetDisputeHistory,
  IGetDisputeHistoryGraphQLResponse,
  IGetDisputeHistoryMsg,
  IGetDisputeHistoryPayload,
} from 'lib/interfaces';

/**
 * Genarates the message payload for TU get dispute history
 * @param data
 * @returns IEnrollPayload
 */
export const createGetDisputeHistoryPayload = (data: IGetDisputeHistoryGraphQLResponse): IGetDisputeHistoryPayload => {
  const id = data.data.getAppData.id?.split(':')?.pop();
  const key = data.data.getAppData.agencies?.transunion?.disputeEnrollmentKey;

  if (!id || !key) {
    console.log(`no id or enrollmentKey provided: id=${id}, key=${key}`);
    return;
  }

  return {
    RequestKey: '',
    ClientKey: id,
    EnrollmentKey: key,
  };
};
/**
 * This method packages the message in a request body and adds account information
 * @param {string} accountCode Brave TU account code (can be overriden if passed as part of message)
 * @param {string} accountName Brave TU account name (can be overriden if passed as part of message)
 * @param {IIGetDisputeHistoryMsg} msg
 * @returns
 */
export const formatGetDisputeHistory = (
  accountCode: string,
  accountName: string,
  msg: string,
): IGetDisputeHistory | undefined => {
  let message: IGetDisputeHistoryMsg = JSON.parse(msg);
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
 * @param {IGetDisputeHistory} msg The packaged message to send in XML format to TU
 * @returns
 */
export const createGetDisputeHistory = (msg: IGetDisputeHistory): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:GetDisputeHistory': {
          'con:request': {
            'data:AccountCode': textConstructor(msg.request.AccountCode),
            'data:AccountName': textConstructor(msg.request.AccountName),
            'data:RequestKey': textConstructor(`BC-${uuid.v4()}`),
            'data:ClientKey': textConstructor(msg.request.ClientKey),
            'data:EnrollmentKey': textConstructor(msg.request.EnrollmentKey),
          },
        },
      },
    },
  };
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};
