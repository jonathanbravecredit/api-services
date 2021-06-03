import {
  IEnrichedIndicativeEnrichment,
  IIndicativeEnrichmentMsg,
} from 'lib/interfaces/indicative-enrichment.interface';
import * as uuid from 'uuid';

export const formatIndicativeEnrichment = (
  accountCode: string,
  accountName: string,
  snsMessage: string,
): IEnrichedIndicativeEnrichment | undefined => {
  let data: IIndicativeEnrichmentMsg = JSON.parse(snsMessage);
  let { message } = data;
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

// TODO may want to keep this fresh with the WSDL
// may want to build a parser to create this from the message
export const createIndicativeEnrichment = (msg: IEnrichedIndicativeEnrichment): string => {
  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:con="https://consumerconnectws.tui.transunion.com/"
    xmlns:data="https://consumerconnectws.tui.transunion.com/data">
    <soapenv:Header />
    <soapenv:Body>
      <con:IndicativeEnrichment>
        <con:request>
          <data:AccountCode>${msg.request.AccountCode}</data:AccountCode>
          <data:AccountName>${msg.request.AccountName}</data:AccountName>
          <data:AdditionalInputs>
            <data:Data>
              <data:Name>${msg.request.AdditionalInputs.Data.Name}</data:Name>
              <data:Value>${msg.request.AdditionalInputs.Data.Value}</data:Value>
            </data:Data>
          </data:AdditionalInputs>
          <data:RequestKey>${msg.request.RequestKey}</data:RequestKey>
          <data:ClientKey>${msg.request.ClientKey}</data:ClientKey>
          <data:Customer>
            <data:CurrentAddress>
              <data:AddressLine1>${msg.request.Customer.CurrentAddress.AddressLine1}</data:AddressLine1>
              <data:AddressLine2>${msg.request.Customer.CurrentAddress.AddressLine2}</data:AddressLine2>
              <data:City>${msg.request.Customer.CurrentAddress.City}</data:City>
              <data:State>${msg.request.Customer.CurrentAddress.State}</data:State>
              <data:Zipcode>${msg.request.Customer.CurrentAddress.Zipcode}</data:Zipcode>
            </data:CurrentAddress>
            <data:DateOfBirth>${msg.request.Customer.DateOfBirth}</data:DateOfBirth>
            <data:FullName>
              <data:FirstName>${msg.request.Customer.FullName.FirstName}</data:FirstName>
              <data:LastName>${msg.request.Customer.FullName.LastName}</data:LastName>
              <data:MiddleName>${msg.request.Customer.FullName.MiddleName}</data:MiddleName>
              <data:Prefix>${msg.request.Customer.FullName.Prefix}</data:Prefix>
              <data:Suffix>${msg.request.Customer.FullName.Suffix}</data:Suffix>
            </data:FullName>
            <data:PreviousAddress>
              <data:AddressLine1>${msg.request.Customer.PreviousAddress.AddressLine1}</data:AddressLine1>
              <data:AddressLine2>${msg.request.Customer.PreviousAddress.AddressLine2}</data:AddressLine2>
              <data:City>${msg.request.Customer.PreviousAddress.City}</data:City>
              <data:State>${msg.request.Customer.PreviousAddress.State}</data:State>
              <data:Zipcode>${msg.request.Customer.PreviousAddress.Zipcode}</data:Zipcode>
            </data:PreviousAddress>
            <data:Ssn>${msg.request.Customer.Ssn}</data:Ssn>
          </data:Customer>
          <data:ServiceBundleCode>${msg.request.ServiceBundleCode}</data:ServiceBundleCode>
        </con:request>
      </con:IndicativeEnrichment>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

  return xml;
};
