import { IGetDisputeStatus, IGetDisputeStatusMsg } from 'lib/interfaces/get-dispute-status.interface';
import { textConstructor } from 'lib/utils/helpers';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import {
  IGetInvestigationResults,
  IGetInvestigationResultsMsg,
} from 'lib/interfaces/get-investigation-results.interface';

/**
 * This method packages the message in a request body and adds account information
 * @param {string} accountCode Brave TU account code (can be overriden if passed as part of message)
 * @param {string} accountName Brave TU account name (can be overriden if passed as part of message)
 * @param {IGetInvestigationResultsMsg} msg
 * @returns
 */
export const formatGetInvestigationResults = (
  accountCode: string,
  accountName: string,
  msg: string,
): IGetInvestigationResults | undefined => {
  let message: IGetInvestigationResultsMsg = JSON.parse(msg);
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
 * @param {IGetInvestigationResults} msg The packaged message to send in XML format to TU
 * @returns
 */
export const createGetInvestigationResults = (msg: IGetInvestigationResults): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:GetInvestigationResults': {
          'con:request': {
            'data:AccountCode': textConstructor(msg.request.AccountCode),
            'data:AccountName': textConstructor(msg.request.AccountName),
            'data:RequestKey': textConstructor(`BC-${uuid.v4()}`),
            'data:DisputeId': textConstructor(msg.request.DisputeId, true),
            'data:EnrollmentKey': textConstructor(msg.request.EnrollmentKey),
          },
        },
      },
    },
  };
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};
