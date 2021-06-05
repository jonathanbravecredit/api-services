import {
  IGetAuthenticationQuestions,
  IGetAuthenticationQuestionsMsg,
} from 'lib/interfaces/get-authentication-questions.interface';
import { textConstructor } from 'lib/utils/helpers';
import * as convert from 'xml-js';
import * as uuid from 'uuid';

export const formatGetAuthenticationQuestions = (
  accountCode: string,
  accountName: string,
  msg: string,
): IGetAuthenticationQuestions | undefined => {
  let message: IGetAuthenticationQuestionsMsg = JSON.parse(msg);
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

export const createGetAuthenticationQuestions = (msg: IGetAuthenticationQuestions): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:GetAuthenticationQuestions': {
          'con:request': {
            'data:AccountCode': textConstructor(msg.request.AccountCode),
            'data:AccountName': textConstructor(msg.request.AccountName),
            'data:RequestKey': textConstructor(uuid.v4()),
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
                'data:AddressLine1': textConstructor(msg.request.Customer.PreviousAddress.AddressLine1, true),
                'data:AddressLine2': textConstructor(msg.request.Customer.PreviousAddress.AddressLine2, true),
                'data:City': textConstructor(msg.request.Customer.PreviousAddress.City, true),
                'data:State': textConstructor(msg.request.Customer.PreviousAddress.State, true),
                'data:Zipcode': textConstructor(msg.request.Customer.PreviousAddress.Zipcode, true),
              },
              'data:PhoneNumber': textConstructor(msg.request.Customer.PhoneNumber, true),
              'data:Ssn': textConstructor(msg.request.Customer.Ssn),
            },
            'data:Email': textConstructor(msg.request.Email, true),
            'data:Language': textConstructor(msg.request.Language, true),
            'data:ServiceBundleCode': textConstructor(msg.request.ServiceBundleCode),
            'data:TrustSessionId': textConstructor(msg.request.TrustSessionId, true),
          },
        },
      },
    },
  };
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};
