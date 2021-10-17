import { returnNestedObject, updateNestedObject } from 'lib/utils/helpers/helpers';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import * as fastXml from 'fast-xml-parser';
import { UpdateAppDataInput } from 'src/api/api.service';
import { XmlFormatter } from 'lib/utils/xml-formatter/xml-formatter';
import {
  IGetAlertNotificationsResponse,
  IGetAlertsNotification,
  IGetAlertsNotificationMsg,
  IGetAlertsNotificationPayload,
} from 'lib/interfaces/transunion/get-alerts-notifications.interface';

/**
 * Genarates the message payload for TU get dispute history
 * @param data
 * @returns IEnrollPayload
 */
export const createGetAlerNotificationsPaylod = (): IGetAlertsNotificationPayload => {
  return {
    RequestKey: '',
  };
};

/**
 * This method packages the message in a request body and adds account information
 * @param accountCode Brave TU account code (can be overriden if passed as part of message)
 * @param accountName Brave TU account name (can be overriden if passed as part of message)
 * @param msg
 * @returns
 */
export const formatGetAlertsNotifications = (
  accountCode: string,
  accountName: string,
  msg: string,
): IGetAlertsNotification | undefined => {
  let message: IGetAlertsNotificationMsg = JSON.parse(msg);
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
 * @param msg The packaged message to send in XML format to TU
 * @returns
 */
export const createGetAlertsNotification = (msg: IGetAlertsNotification): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:GetAlertNotificationsForAllUsers': {
          'con:request': {
            'data:AccountCode': XmlFormatter.textConstructor(msg.request.AccountCode),
            'data:AccountName': XmlFormatter.textConstructor(msg.request.AccountName),
            'data:RequestKey': XmlFormatter.textConstructor(`BC-${uuid.v4()}`),
            'data:AdditionalInputs': {
              'data:Data': {
                'data:Name': XmlFormatter.textConstructor('DisputeVersion'),
                'data:Value': XmlFormatter.textConstructor('2'),
              },
            },
          },
        },
      },
    },
  };
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};

/**
 * This method parses and enriches the state data
 *  - IMPORTANT! This is the only method passed in to the Sync constructor
 * @param data
 * @param getInvestigationResult
 * @returns
 */
export const enrichGetAlertNotifications = (
  data: UpdateAppDataInput | undefined,
  getAlertNotificationResult: unknown,
): UpdateAppDataInput | undefined => {
  // !!!! TBD !!!!
  // this is updating the data...assume that you would have call this while looping through all the results
  // from the alert notifications array that comes back

  // if (!data) return;
  // const disputes = data.agencies?.transunion?.disputes;
  // if (!disputes?.length) return; // no disputes saved to find
  // const updated: DisputeInput[] = disputes.map((dispute) => {
  //   if (dispute.disputeId == getInvestigationResult.disputeId) {
  //     return {
  //       ...dispute,
  //       disputeCreditBureau: JSON.stringify(getInvestigationResult.getInvestigationResult.CreditBureau),
  //       disputeInvestigationResults: JSON.stringify(getInvestigationResult.getInvestigationResult.InvestigationResults),
  //     };
  //   } else {
  //     return dispute;
  //   }
  // });
  // const mapped = {
  //   ...data,
  //   agencies: {
  //     ...data.agencies,
  //     transunion: {
  //       ...data.agencies?.transunion,
  //       disputes: updated,
  //     },
  //   },
  // };
  // console.log('mapped', mapped.agencies?.transunion.disputes);
  // return mapped;
  return;
};

/**
 * Parse the GetDisputeStatus response
 * @param xml
 * @returns IGetDisputeStatusResponse
 */
export const parseGetAlertNotifications = (xml: string, options: any): IGetAlertNotificationsResponse => {
  const obj: IGetAlertNotificationsResponse = fastXml.parse(xml, options);
  return obj;
};
