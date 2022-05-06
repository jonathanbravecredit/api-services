import { textConstructor } from 'libs/utils/helpers/helpers';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import {
  ICancelEnroll,
  ICancelEnrollGraphQLResponse,
  ICancelEnrollRequest,
} from 'libs/transunion/cancel-enrollment/cancel-enrollment.interface';

/**
 * Genarates the message payload for TU Enroll service
 * @param data
 * @returns IEnrollPayload
 */
export const createCancelEnrollmentPayload = (data: ICancelEnrollGraphQLResponse): ICancelEnrollRequest => {
  const id = data.data.getAppData?.id?.split(':')?.pop();
  const key = data.data.getAppData?.agencies?.transunion?.enrollmentKey;
  if (!id || !key) {
    console.log(`no id or key provided: id=${id},  key=${key}`);
    return;
  }

  return {
    RequestKey: '', // gets added below
    AdditionalInputs: {
      Data: {
        Name: 'CreditReportVersion',
        Value: '7.1',
      },
    },
    ClientKey: id,
    EnrollmentKey: key,
  };
};

/**
 * Add the header information to the formated payload
 * @param accountCode
 * @param accountName
 * @param msg
 * @returns
 */
export const formatCancelEnroll = (
  accountCode: string,
  accountName: string,
  msg: string,
): ICancelEnroll | undefined => {
  let message: ICancelEnrollRequest = JSON.parse(msg);
  // consider adding validation here
  return message
    ? {
        request: {
          AccountCode: accountCode,
          AccountName: accountName,
          ...message,
        },
      }
    : undefined;
};

/**
 * Creates the JSON object the XML parser expects
 * - version 7 = CreditReports
 * - version 7.1 = Disputes
 * @param {IEnroll} msg
 * @returns
 */
export const createCancelEnroll = (msg: ICancelEnroll): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:CancelEnrollment': {
          'con:request': {
            'data:AccountCode': textConstructor(msg.request.AccountCode),
            'data:AccountName': textConstructor(msg.request.AccountName),
            'data:AdditionalInputs': {
              'data:Data': {
                'data:Name': textConstructor('CreditReportVersion'),
                'data:Value': textConstructor(msg.request.AdditionalInputs?.Data.Value || '7'),
              },
            },
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
