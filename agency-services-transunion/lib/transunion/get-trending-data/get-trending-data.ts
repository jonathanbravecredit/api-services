import * as convert from 'xml-js';
import * as uuid from 'uuid';
import {
  IGetTrendingData,
  IGetTrendingDataMsg,
  IGetTrendingDataPayload,
  IGetTrendingDataRequest,
} from 'lib/interfaces/transunion/get-trending-data.interface';
import { textConstructor } from 'lib/utils';

/**
 * Genarates the message payload for TU GetTrendingData service
 * @param data
 * @param params
 * @returns
 */
export const createGetTrendingDataPayload = (data: IGetTrendingDataRequest): IGetTrendingDataPayload => {
  const id = data.id?.split(':')?.pop();
  const fromDate = data.params.fromDate;
  const toDate = data.params.toDate;

  if (!id || !fromDate) {
    console.log(`no id or fromDate provided: id=${id} or fromDate=${fromDate}`);
    return;
  }

  return {
    RequestKey: '',
    AdditionalInputs: {
      Data: {
        Name: 'CreditReportVersion',
        Value: '7',
      },
    },
    ClientKey: id,
    FromDate: fromDate,
    GetPartnerTrendingData: 'false',
    GetProductTrendingData: 'true',
    ProductDisplay: 'false',
  };
};

export const formatGetTrendingData = (
  accountCode: string,
  accountName: string,
  msg: string,
): IGetTrendingData | undefined => {
  let message: IGetTrendingDataMsg = JSON.parse(msg);
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
export const createGetTrendingData = (msg: IGetTrendingData): string => {
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
        'con:GetTrendingData': {
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
            'data:FromDate': textConstructor(msg.request.FromDate),
            'data:GetPartnerTrendingData': textConstructor(msg.request.GetPartnerTrendingData),
            'data:GetProductTrendingData': textConstructor(msg.request.GetProductTrendingData),
            'data:ProductDisplay': textConstructor(msg.request.ProductDisplay, true),
          },
        },
      },
    },
  };
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};
