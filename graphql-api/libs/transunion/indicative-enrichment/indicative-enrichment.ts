import { MONTH_MAP } from 'libs/data/constants';
import {
  IEnrichedIndicativeEnrichment,
  IIndicativeEnrichmentPayload,
} from 'libs/transunion/indicative-enrichment/indicative-enrichment.interface';
import { textConstructor } from 'libs/utils/helpers/helpers';
import * as uuid from 'uuid';
import * as convert from 'xml-js';

export const formatIndicativeEnrichment = (
  accountCode: string,
  accountName: string,
  msg: string,
): IEnrichedIndicativeEnrichment | undefined => {
  const parsed: IIndicativeEnrichmentPayload = JSON.parse(msg);
  return {
    request: {
      AccountCode: accountCode,
      AccountName: accountName,
      AdditionalInputs: {
        Data: {
          Name: 'CreditReportVersion',
          Value: '7.1',
        },
      },
      RequestKey: '',
      ClientKey: parsed.id,
      Customer: {
        CurrentAddress: {
          AddressLine1: parsed.address.addressOne || '',
          AddressLine2: parsed.address.addressTwo || '',
          City: parsed.address.city || '',
          State: parsed.address.state || '',
          Zipcode: parsed.address.zip || '',
        },
        PreviousAddress: {},
        DateOfBirth:
          `${parsed.dob.year}-${MONTH_MAP[parsed.dob.month.toLowerCase()]}-${`0${parsed.dob.day}`.slice(-2)}` || '',
        FullName: {
          FirstName: parsed.name.first || '',
          LastName: parsed.name.last || '',
          MiddleName: parsed.name.middle || '',
          Prefix: null,
          Suffix: null,
        },
        Ssn: `000000000${parsed.ssn.lastfour}`.slice(-9) || '',
      },
      ServiceBundleCode: 'CC2BraveCreditIndicativeEnrichment',
    },
  };
};

// TODO may want to keep this fresh with the WSDL
// may want to build a parser to create this from the message
export const createIndicativeEnrichment = (msg: IEnrichedIndicativeEnrichment): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:IndicativeEnrichment': {
          'con:request': {
            'data:AccountCode': textConstructor(msg.request.AccountCode),
            'data:AccountName': textConstructor(msg.request.AccountName),
            'data:AdditionalInputs': {
              'data:Data': {
                'data:Name': textConstructor(msg.request.AdditionalInputs.Data.Name),
                'data:Value': textConstructor(msg.request.AdditionalInputs.Data.Value),
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
              'data:PreviousAddress': {
                'data:AddressLine1': textConstructor(msg.request.Customer.PreviousAddress?.AddressLine1, true),
                'data:AddressLine2': textConstructor(msg.request.Customer.PreviousAddress?.AddressLine2, true),
                'data:City': textConstructor(msg.request.Customer.PreviousAddress?.City, true),
                'data:State': textConstructor(msg.request.Customer.PreviousAddress?.State, true),
                'data:Zipcode': textConstructor(msg.request.Customer.PreviousAddress?.Zipcode, true),
              },
              'data:Ssn': textConstructor(msg.request.Customer.Ssn),
            },
            'data:ServiceBundleCode': textConstructor(msg.request.ServiceBundleCode),
          },
        },
      },
    },
  };

  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};
