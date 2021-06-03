import { IAuthentication, IAuthenticationMsg } from 'lib/interfaces/authentication.interface';

export const formatAuthentication = (
  accountCode: string,
  accountName: string,
  snsMessage: string,
): IAuthentication | undefined => {
  let data: IAuthenticationMsg = JSON.parse(snsMessage);
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

export const createAuthentication = (msg: IAuthentication): string => {
  const xml = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:con="https://consumerconnectws.tui.transunion.com/" xmlns:data="https://consumerconnectws.tui.transunion.com/data">
   <soapenv:Header/>
   <soapenv:Body>
      <con:GetAuthenticationQuestions>
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
               <data:PhoneNumber>${msg.request.Customer.PhoneNumber}</data:PhoneNumber>
               <data:PreviousAddress>
                  <data:AddressLine1>${msg.request.Customer.PreviousAddress.AddressLine1}</data:AddressLine1>
                  <data:AddressLine2>${msg.request.Customer.PreviousAddress.AddressLine2}</data:AddressLine2>
                  <data:City>${msg.request.Customer.PreviousAddress.City}</data:City>
                  <data:State>${msg.request.Customer.PreviousAddress.State}</data:State>
                  <data:Zipcode>${msg.request.Customer.PreviousAddress.Zipcode}</data:Zipcode>
               </data:PreviousAddress>
               <data:Ssn>${msg.request.Customer.Ssn}</data:Ssn>
            </data:Customer>
            <data:Email>${msg.request.Email}</data:Email>
            <data:Language>${msg.request.Language}</data:Language>
            <data:ServiceBundleCode>${msg.request.ServiceBundleCode}</data:ServiceBundleCode>
            <data:TrustSessionId>${msg.request.TrustSessionId}</data:TrustSessionId>
         </con:request>
      </con:GetAuthenticationQuestions>
   </soapenv:Body>
</soapenv:Envelope>
  `;
  return xml;
};
