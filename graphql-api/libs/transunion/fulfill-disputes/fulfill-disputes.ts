import { mapReportResponse, returnNestedObject, textConstructor, updateNestedObject } from 'libs/utils/helpers/helpers';
import * as convert from 'xml-js';
import * as fastXml from 'fast-xml-parser';
import * as uuid from 'uuid';
import * as he from 'he';
import {
  IFulfill,
  IFulfillGraphQLResponse,
  IFulfillMsg,
  IFulfillPayload,
  IFulfillResponse,
  IFulfillResult,
  IFulfillServiceProductResponse,
} from 'libs/interfaces';
import { MONTH_MAP } from 'libs/data/constants';
import { UpdateAppDataInput } from 'src/api/api.service';

/**
 * Genarates the message payload for TU Enroll service
 * @param data
 * @returns IEnrollPayload
 */
export const createFulfillDisputesPayload = (data: IFulfillGraphQLResponse): IFulfillPayload => {
  const id = data.data.getAppData.id?.split(':')?.pop();
  const attrs = data.data.getAppData.user?.userAttributes;
  const dob = attrs?.dob;
  const serviceBundleCode = 'CC2BraveCreditTUReport24Hour';
  const enrollmentKey = data.data.getAppData.agencies?.transunion?.disputeEnrollmentKey;

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
    EnrollmentKey: enrollmentKey,
    ServiceBundleCode: serviceBundleCode,
  };
};

export const formatFulfillDisputes = (accountCode: string, accountName: string, msg: string): IFulfill | undefined => {
  let message: IFulfillMsg = JSON.parse(msg);
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
export const createFulfillDisputes = (msg: IFulfill): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:Fulfill': {
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
            'data:EnrollmentKey': textConstructor(msg.request.EnrollmentKey),
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
 * Parse the Fulfill response including the embedded Service Product Objects
 * @param xml
 * @returns IFulfillResponse
 */
export const parseFulfillDisputes = (xml: string, options: any): IFulfillResponse => {
  const obj: IFulfillResponse = fastXml.parse(xml, options);
  const resp = returnNestedObject<any>(obj, 'ServiceProductResponse');
  if (resp instanceof Array) {
    const mapped = resp.map((prod) => {
      let prodObj = prod['ServiceProductObject']['#text'];
      if (typeof prodObj === 'string') {
        // two decodes, because comes in encoded, and our defualt parser options encode it again.
        let clean = he.decode(he.decode(prodObj));
        const parsed = fastXml.parse(clean, options);
        return {
          ...prod,
          ServiceProductObject: parsed,
        };
      } else {
        return prod;
      }
    });
    const updated = updateNestedObject(obj, 'ServiceProductResponse', [...mapped.filter(Boolean)]);
    return updated ? updated : obj;
  } else {
    return obj;
  }
};

/**
 * This method parses and enriches the state data
 * @param {UpdateAppDataInput} data
 * @param {IFulfillResult} enroll
 * @returns {UpdateAppDataInput | undefined }
 */
export const enrichFulfillDisputesData = (
  data: UpdateAppDataInput | undefined,
  fulfill: IFulfillResult, // IFulfillResult
): UpdateAppDataInput | undefined => {
  if (!data) return;

  const fulfilledOn = new Date().toISOString();
  const serviceBundleFulfillmentKey = fulfill.ServiceBundleFulfillmentKey;

  const mapped = {
    ...data,
    agencies: {
      ...data.agencies,
      transunion: {
        ...data.agencies?.transunion,
        fulfilledOn: fulfilledOn,
        serviceBundleFulfillmentKey: serviceBundleFulfillmentKey, // this always has to be synced to the report in fulfill fields
      },
    },
  };
  console.log('mapped', mapped);
  return mapped;
};
