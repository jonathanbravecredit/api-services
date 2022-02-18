import * as convert from 'xml-js';
import * as dayjs from 'dayjs';
import * as uuid from 'uuid';
import * as _ from 'lodash';
import { IFulfillGraphQLResponse, IFulfillRequest } from 'lib/interfaces';
import { TURequestBase } from 'lib/transunion/tu/TURequestBase';
import { XMLUtil as XML } from 'lib/utils/xml/XMLUtil';

export class FulfillRequester extends TURequestBase<IFulfillGraphQLResponse> {
  request: IFulfillRequest;
  xml: string;

  constructor(protected data: IFulfillGraphQLResponse) {
    super(data);
    super.init();
    this.serviceBundleCode = 'CC2BraveCreditTUReportV3Score';
  }

  get dob() {
    const { year, month, day } = this.attributes.dob;
    const badDate = `${year}-${month}-${day}`;
    return dayjs(badDate, 'YYYY-MMM-D').format('YYYY-MM-DD');
  }

  generateRequest(): IFulfillRequest {
    this.request = {
      AccountCode: this.accountCode,
      AccountName: this.accountName,
      RequestKey: `BC-${uuid.v4()}`,
      AdditionalInputs: {
        Data: {
          Name: 'CreditReportVersion',
          Value: '7.1',
        },
      },
      ClientKey: this.clientKey,
      Customer: {
        CurrentAddress: {
          AddressLine1: this.attributes.address?.addressOne || '',
          AddressLine2: this.attributes.address?.addressTwo || '',
          City: this.attributes.address?.city || '',
          State: this.attributes.address?.state || '',
          Zipcode: this.attributes.address?.zip || '',
        },
        DateOfBirth: this.dob,
        FullName: {
          FirstName: this.attributes.name?.first || '',
          LastName: this.attributes.name?.last || '',
          MiddleName: this.attributes.name?.middle || '',
        },
        Ssn: this.attributes.ssn?.full || '',
      },
      EnrollmentKey: this.enrollmentKey,
      ServiceBundleCode: this.serviceBundleCode,
    } as IFulfillRequest;
    return this.request;
  }

  generateXML(): string {
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
              'data:AccountCode': XML.textConstructor(this.request.AccountCode),
              'data:AccountName': XML.textConstructor(this.request.AccountName),
              'data:AdditionalInputs': {
                'data:Data': {
                  'data:Name': XML.textConstructor('CreditReportVersion'),
                  'data:Value': XML.textConstructor(this.request.AdditionalInputs?.Data.Value || '7.1'),
                },
              },
              'data:RequestKey': XML.textConstructor(this.request.RequestKey),
              'data:ClientKey': XML.textConstructor(this.request.ClientKey),
              'data:Customer': {
                'data:CurrentAddress': {
                  'data:AddressLine1': XML.textConstructor(this.request.Customer.CurrentAddress.AddressLine1),
                  'data:AddressLine2': XML.textConstructor(this.request.Customer.CurrentAddress.AddressLine2, true),
                  'data:City': XML.textConstructor(this.request.Customer.CurrentAddress.City),
                  'data:State': XML.textConstructor(this.request.Customer.CurrentAddress.State),
                  'data:Zipcode': XML.textConstructor(this.request.Customer.CurrentAddress.Zipcode),
                },
                'data:DateOfBirth': XML.textConstructor(this.request.Customer.DateOfBirth),
                'data:FullName': {
                  'data:FirstName': XML.textConstructor(this.request.Customer.FullName.FirstName),
                  'data:LastName': XML.textConstructor(this.request.Customer.FullName.LastName),
                  'data:MiddleName': XML.textConstructor(this.request.Customer.FullName.MiddleName, true),
                  'data:Prefix': XML.textConstructor(this.request.Customer.FullName.Prefix, true),
                  'data:Suffix': XML.textConstructor(this.request.Customer.FullName.Suffix, true),
                },
                'data:Ssn': XML.textConstructor(this.request.Customer.Ssn),
              },
              'data:EnrollmentKey': XML.textConstructor(this.request.EnrollmentKey),
              'data:Language': XML.textConstructor(this.request.Language, true),
              'data:ServiceBundleCode': XML.textConstructor(this.request.ServiceBundleCode),
            },
          },
        },
      },
    };
    this.xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
    return this.xml;
  }
}
