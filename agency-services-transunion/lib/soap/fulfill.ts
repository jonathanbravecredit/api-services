import { returnNestedObject, textConstructor, updateNestedObject } from 'lib/utils/helpers';
import * as convert from 'xml-js';
import * as fastXml from 'fast-xml-parser';
import * as uuid from 'uuid';
import { IFulfill, IFulfillMsg, IFulfillResponse } from 'lib/interfaces/fulfill.interface';

export const formatFulfill = (accountCode: string, accountName: string, msg: string): IFulfill | undefined => {
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
export const createFulfill = (msg: IFulfill): string => {
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
 * @returns
 */
export const parseFulfill = (xml: string, options: any): IFulfillResponse => {
  const obj: IFulfillResponse = returnNestedObject(fastXml.parse(xml, options), 'FulfillResponse');
  const resp = returnNestedObject(obj, 'a:ServiceProductResponse');
  if (resp instanceof Array) {
    const mapped = resp.map((prod) => {
      let prodObj = prod['a:ServiceProductObject'];
      if (typeof prodObj === 'string') {
        let clean = prodObj.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#xD;/g, '');
        return {
          ...prod,
          'a:ServiceProductObject': fastXml.parse(clean),
        };
      }
    });
    const updated = updateNestedObject(obj, 'a:ServiceProductResponse', [...mapped]);
    return updated ? updated : obj;
  } else {
    return obj;
  }
};
