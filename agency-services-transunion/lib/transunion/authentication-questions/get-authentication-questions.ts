import { IGetAuthenticationQuestions, IGetAuthenticationQuestionsPayload } from 'lib/interfaces';
import { textConstructor } from 'lib/utils/helpers/helpers';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import { MONTH_MAP } from 'lib/data/constants';

/**
 * This method packages the message in a request body and adds account information
 * @param {string} accountCode Brave TU account code (can be overriden if passed as part of message)
 * @param {string} accountName Brave TU account name (can be overriden if passed as part of message)
 * @param {IGetAuthenticationQuestionsMsg} msg
 * @returns
 */
export const formatGetAuthenticationQuestions = (
  accountCode: string,
  accountName: string,
  msg: IGetAuthenticationQuestionsPayload,
): IGetAuthenticationQuestions | undefined => {
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
      ClientKey: msg.id,
      Customer: {
        CurrentAddress: {
          AddressLine1: msg.address.addressOne || '',
          AddressLine2: msg.address.addressTwo || '',
          City: msg.address.city || '',
          State: msg.address.state || '',
          Zipcode: msg.address.zip || '',
        },
        PreviousAddress: {},
        DateOfBirth: `${msg.dob.year}-${MONTH_MAP[msg.dob.month.toLowerCase()]}-${`0${msg.dob.day}`.slice(-2)}` || '',
        FullName: {
          FirstName: msg.name.first || '',
          LastName: msg.name.last || '',
          MiddleName: msg.name.middle || '',
          Prefix: null,
          Suffix: null,
        },
        PhoneNumber: msg.phone.primary || '',
        Ssn: msg.ssn.full || '',
      },
      ServiceBundleCode: 'CC2BraveCreditAuthentication',
    },
  };
};

/**
 * This method transforms the JSON message to the XML request
 * @param {IGetAuthenticationQuestions} msg The packaged message to send in XML format to TU
 * @returns
 */
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
