import { mapReportResponse, returnNestedObject, textConstructor, updateNestedObject } from 'libs/utils/helpers/helpers';
import * as convert from 'xml-js';
import * as fastXml from 'fast-xml-parser';
import * as he from 'he';
import * as uuid from 'uuid';
import {
  IEnroll,
  IEnrollGraphQLResponse,
  IEnrollPayload,
  IEnrollResponse,
  IEnrollResult,
  IEnrollServiceProductResponse,
} from 'libs/interfaces';
import { MONTH_MAP } from 'libs/data/constants';
import { UpdateAppDataInput } from 'src/api/api.service';

/**
 * Genarates the message payload for TU Enroll service
 * @param data
 * @returns IEnrollPayload
 */
export const createEnrollDisputesPayload = (data: IEnrollGraphQLResponse): any => {
  const id = data.data.getAppData.id?.split(':')?.pop();
  const attrs = data.data.getAppData.user?.userAttributes;
  const dob = attrs?.dob;
  const serviceBundleCode = 'CC2BraveCreditTUDispute';

  if (!id || !attrs || !dob) {
    console.log(`no id, attributes, or dob provided: id=${id},  attrs=${attrs}, dob=${dob}`);
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
    ServiceBundleCode: serviceBundleCode,
  };
};

/**
 * Add the header information to the formated payload
 * @param accountCode
 * @param accountName
 * @param msg
 * @returns
 */
export const formatEnrollDisputes = (accountCode: string, accountName: string, msg: string): IEnroll | undefined => {
  let message: any = JSON.parse(msg);
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
export const createEnrollDisputes = (msg: IEnroll): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:Enroll': {
          'con:request': {
            'data:AccountCode': textConstructor(msg.request.AccountCode),
            'data:AccountName': textConstructor(msg.request.AccountName),
            'data:AdditionalInputs': {
              'data:Data': {
                'data:Name': textConstructor('CreditReportVersion'),
                'data:Value': textConstructor(msg.request.AdditionalInputs?.Data.Value || '7.1'),
              },
            },
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
              'data:Ssn': textConstructor(msg.request.Customer.Ssn),
            },
            'data:Email': textConstructor(msg.request.Email, true),
            'data:Language': textConstructor(msg.request.Language, true),
            'data:ServiceBundleCode': textConstructor(msg.request.ServiceBundleCode),
          },
        },
      },
    },
  };
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};

/**
 * Parse the Enroll response including the embedded Service Product Objects
 * @param xml
 * @returns
 */
export const parseEnrollDisputes = (xml: string, options: any): IEnrollResponse => {
  const obj: IEnrollResponse = fastXml.parse(xml, options);
  return obj;
};

/**
 * This method parses and enriches the state data
 * @param {UpdateAppDataInput} data
 * @param {IEnrollResponse} enroll
 * @returns
 */
export const enrichEnrollDisputesData = (
  data: UpdateAppDataInput | undefined,
  enroll: IEnrollResult,
): UpdateAppDataInput | undefined => {
  if (!data) return;
  let enrolledOn = new Date().toISOString();
  const enrollmentKey = enroll.EnrollmentKey;
  const serviceBundleFulfillmentKey = enroll.ServiceBundleFulfillmentKey;
  const prodResponse = enroll.ServiceProductFulfillments.ServiceProductResponse;
  console.log('enroll enrollmentkey ===> ', JSON.stringify(enrollmentKey));
  console.log('enroll serviceBundleFulfillmentKey ===> ', JSON.stringify(serviceBundleFulfillmentKey));
  console.log('enroll prodResponse ===> ', JSON.stringify(prodResponse));
  return {
    ...data,
    agencies: {
      ...data.agencies,
      transunion: {
        ...data.agencies?.transunion,
        disputeEnrolled: true,
        disputeEnrolledOn: enrolledOn,
        disputeEnrollmentKey: enrollmentKey,
        disputeServiceBundleFulfillmentKey: serviceBundleFulfillmentKey,
      },
    },
  };
};
