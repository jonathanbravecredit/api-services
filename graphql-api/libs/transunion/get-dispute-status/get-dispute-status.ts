import * as fastXml from 'fast-xml-parser';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import { MONTH_MAP } from 'libs/data/constants';
import { textConstructor } from 'libs/utils';
import { IProxyQueryGetAppData } from 'libs/interfaces';
import {
  IGetDataForGetDisputeStatus,
  IGetDisputeStatusPayload,
  IGetDisputeStatus,
  IGetDisputeStatusMsg,
  IGetDisputeStatusResponse,
} from 'libs/transunion/get-dispute-status/get-dispute-status.interface';

/**
 * Genarates the message payload for TU Enroll service
 * @param data
 * @returns IEnrollPayload
 */
export const createGetDisputeStatusPayload = ({
  data,
  disputeId,
}: {
  data: IProxyQueryGetAppData<IGetDataForGetDisputeStatus>;
  disputeId?: string;
}): IGetDisputeStatusPayload => {
  const id = data.data.getAppData.id?.split(':')?.pop();
  const attrs = data.data.getAppData.user?.userAttributes;
  const dob = attrs?.dob;

  if (!id || !attrs || !dob) {
    console.log(`no id, attributes, or dob provided: id=${id},  attrs=${attrs}, dob=${dob}`);
    return;
  }

  return {
    RequestKey: '',
    AdditionalInputs: {
      Data: {
        Name: 'CreditReportVersion',
        Value: '7.1',
      },
    },
    ClientKey: id,
    Customer: {
      CurrentAddress: {
        AddressLine1: attrs.address?.addressOne || '',
        AddressLine2: attrs.address?.addressTwo || '',
        City: attrs.address?.city || '',
        State: attrs.address?.state || '',
        Zipcode: attrs.address?.zip || '',
      },
      DateOfBirth: `${attrs.dob?.year}-${MONTH_MAP[dob?.month?.toLowerCase() || '']}-${`0${dob.day}`.slice(-2)}` || '',
      FullName: {
        FirstName: attrs.name?.first || '',
        LastName: attrs.name?.last || '',
        MiddleName: attrs.name?.middle || '',
      },
      Ssn: attrs.ssn?.full || '',
    },
    DisputeId: disputeId,
    EnrollmentKey: data.data.getAppData.agencies?.transunion?.disputeEnrollmentKey,
  };
};

/**
 * This method packages the message in a request body and adds account information
 * @param accountCode Brave TU account code (can be overriden if passed as part of message)
 * @param accountName Brave TU account name (can be overriden if passed as part of message)
 * @param msg
 * @returns
 */
export const formatGetDisputeStatus = (
  accountCode: string,
  accountName: string,
  msg: string,
): IGetDisputeStatus | undefined => {
  let message: IGetDisputeStatusMsg = JSON.parse(msg);
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
export const createGetDisputeStatus = (msg: IGetDisputeStatus): string => {
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
        'con:GetDisputeStatus': {
          'con:request': {
            'data:AccountCode': textConstructor(msg.request.AccountCode),
            'data:AccountName': textConstructor(msg.request.AccountName),
            'data:RequestKey': textConstructor(`BC-${uuid.v4()}`),
            'data:ClientKey': textConstructor(msg.request.ClientKey),
            'data:Customer': {
              'data:CurrentAddress': {
                'data:AddressLine1': textConstructor(msg.request.Customer.CurrentAddress.AddressLine1),
                'data:AddressLine2': textConstructor(msg.request.Customer.CurrentAddress.AddressLine2, true),
                'data:City': textConstructor(msg.request.Customer.CurrentAddress.City),
                'data:State': textConstructor(msg.request.Customer.CurrentAddress.State),
                'data:Zipcode': textConstructor(msg.request.Customer.CurrentAddress.Zipcode),
              },
              'data:DateOfBirth': textConstructor(msg.request.Customer.DateOfBirth),
              'data:FullName': {
                'data:FirstName': textConstructor(msg.request.Customer.FullName.FirstName),
                'data:LastName': textConstructor(msg.request.Customer.FullName.LastName),
                'data:MiddleName': textConstructor(msg.request.Customer.FullName.MiddleName, true),
                'data:Prefix': textConstructor(msg.request.Customer.FullName.Prefix, true),
                'data:Suffix': textConstructor(msg.request.Customer.FullName.Suffix, true),
              },
              'data:PhoneNumber': textConstructor(msg.request.Customer.PhoneNumber, true),
              'data:Ssn': textConstructor(msg.request.Customer.Ssn),
            },
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

/**
 * Parse the GetDisputeStatus response
 * @param xml
 * @returns IGetDisputeStatusResponse
 */
export const parseGetDisputeStatus = (xml: string, options: any): IGetDisputeStatusResponse => {
  const obj: IGetDisputeStatusResponse = fastXml.parse(xml, options);
  console.log('parsed dispute obj ==> ', JSON.stringify(obj));
  return obj;
};
