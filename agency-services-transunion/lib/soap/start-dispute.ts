import {
  IAka,
  IAttachment,
  IClaimCode,
  IEmployers,
  IIndicativeDisputes,
  ILineItem,
  IStartDispute,
  IStartDisputeGraphQLResponse,
  IStartDisputeMsg,
  IStartDisputeRequest,
  IStartDisputeResponse,
  IStartDisputeResult,
} from 'lib/interfaces/start-dispute.interface';
import { returnNestedObject, textConstructor } from 'lib/utils/helpers';
import * as fastXml from 'fast-xml-parser';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import { IDisputeReason, IProcessDisputeTradelineResult } from 'lib/interfaces/disputes.interface';
import { MONTH_MAP } from 'lib/data/constants';
import { CreateDisputeInput } from 'src/api/api.service';
import { IGetAppDataRequest } from 'lib/interfaces/get-app-data.interface';

/**
 * Genarates the message payload for TU Fulfill request
 * TODO: need to incorporate Personal and Public items
 * @param { UpdateAppDataInput} data
 * @returns {IGetDisputeStatusRequest | undefined }
 */
export const createStartDisputePayload = (
  data: IStartDisputeGraphQLResponse,
  disputes: IProcessDisputeTradelineResult[],
): IStartDisputeMsg | undefined => {
  const id = data.data.getAppData.id?.split(':')?.pop();
  const attrs = data.data.getAppData.user?.userAttributes;
  const dob = attrs?.dob;

  if (!id || !attrs || !dob) {
    console.log(`no id, attributes, or dob provided: id=${id},  attrs=${attrs}, dob=${dob}`);
    return;
  }
  console.log('id in StartDispute', id);
  return {
    AccountCode: '123456789',
    AccountName: 'CC2BraveCredit',
    RequestKey: '',
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
    EnrollmentKey: data.data.getAppData.agencies?.transunion?.disputeEnrollmentKey,
    LineItems: parseDisputeToLineItem(disputes),
    ServiceBundleFulfillmentKey: data.data.getAppData.agencies?.transunion?.serviceBundleFulfillmentKey,
    ServiceProductFulfillmentKey: null,
  };
};

/**
 * Helper function to parse the disputes to Line Items
 * @param {IProcessDisputeTradelineResult[]} disputes
 * @returns {ILineItem[] | ILineItem}
 */
export const parseDisputeToLineItem = (disputes: IProcessDisputeTradelineResult[]): ILineItem[] | ILineItem | null => {
  if (!disputes.length) return null;
  return disputes
    .map((item) => {
      const reason = item?.result?.data?.reasons;
      const handle = item?.tradeline?.Tradeline?.handle;
      console.log('parseDisputeToLineItem:reason ===> ', reason);
      console.log('parseDisputeToLineItem:handle ===> ', handle);
      if (reason !== undefined) {
        return {
          LineItem: {
            ClaimCodes: parseReasonsToClaimCodes(reason),
            CreditReportItem: handle,
            LineItemComment: 'Account Tradeline',
          },
        };
      }
      return null;
    })
    .filter(Boolean);
};

/**
 * Helper function to parse the reasons to Claim Codes
 * @param {[(IDisputeReason | undefined), (IDisputeReason | undefined)]} reasons
 * @returns {IClaimCode[] | IClaimCode}
 */
export const parseReasonsToClaimCodes = (
  reasons: [IDisputeReason | undefined, IDisputeReason | undefined],
): IClaimCode[] | IClaimCode | null => {
  if (!reasons.length) return null;
  return reasons.map((code) => {
    return {
      ClaimCode: {
        Code: code?.claimCode || '',
      },
    };
  });
};

/**
 * This method packages the message in a request body and adds account information
 * @param {string} accountCode Brave TU account code (can be overriden if passed as part of message)
 * @param {string} accountName Brave TU account name (can be overriden if passed as part of message)
 * @param {IIGetDisputeStatusMsg} msg
 * @returns
 */
export const formatStartDispute = (
  accountCode: string,
  accountName: string,
  msg: string,
): IStartDispute | undefined => {
  let message: IStartDisputeMsg = JSON.parse(msg);
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

export const mapAttachments = (attachments: IAttachment | IAttachment[] | undefined): any | null => {
  if (!attachments) return textConstructor(null, true);
  return attachments instanceof Array
    ? attachments.map((attach: IAttachment) => {
        return {
          'data:Attachment': {
            'data:FileName': textConstructor(attach.Attachment?.FileName, true),
            'data:FileType': textConstructor(attach.Attachment?.FilteType, true),
          },
        };
      })
    : {
        'data:Attachment': {
          'data:FileName': textConstructor(attachments.Attachment?.FileName, true),
          'data:FileType': textConstructor(attachments.Attachment?.FilteType, true),
        },
      };
};

export const mapEmployers = (employers: IEmployers | IEmployers[] | undefined): any => {
  if (!employers) return textConstructor(null, true);
  return employers instanceof Array
    ? employers.map((e: IEmployers) => {
        return {
          'data:Employer': {
            'data:City': textConstructor(e.Employer?.City, true),
            'data:Delete': textConstructor(e.Employer?.Delete, true),
            'data:Directional': textConstructor(e.Employer?.Directional, true),
            'data:EndDate': textConstructor(e.Employer?.EndDate, true),
            'data:HouseNumber': textConstructor(e.Employer?.HouseNumber, true),
            'data:Name': textConstructor(e.Employer?.Name, true),
            'data:Number': textConstructor(e.Employer?.Number, true),
            'data:Occupation': textConstructor(e.Employer?.Occupation, true),
            'data:StartDate': textConstructor(e.Employer?.StartDate, true),
            'data:State': textConstructor(e.Employer?.State, true),
            'data:StreetName': textConstructor(e.Employer?.StreetName, true),
            'data:ThoroughFare': textConstructor(e.Employer?.ThoroughFare, true),
            'data:ZipCode': textConstructor(e.Employer?.ZipCode, true),
            'data:ZipCodeExt': textConstructor(e.Employer?.ZipCodeExt, true),
          },
        };
      })
    : {
        'data:Employer': {
          'data:City': textConstructor(employers.Employer?.City, true),
          'data:Delete': textConstructor(employers.Employer?.Delete, true),
          'data:Directional': textConstructor(employers.Employer?.Directional, true),
          'data:EndDate': textConstructor(employers.Employer?.EndDate, true),
          'data:HouseNumber': textConstructor(employers.Employer?.HouseNumber, true),
          'data:Name': textConstructor(employers.Employer?.Name, true),
          'data:Number': textConstructor(employers.Employer?.Number, true),
          'data:Occupation': textConstructor(employers.Employer?.Occupation, true),
          'data:StartDate': textConstructor(employers.Employer?.StartDate, true),
          'data:State': textConstructor(employers.Employer?.State, true),
          'data:StreetName': textConstructor(employers.Employer?.StreetName, true),
          'data:ThoroughFare': textConstructor(employers.Employer?.ThoroughFare, true),
          'data:ZipCode': textConstructor(employers.Employer?.ZipCode, true),
          'data:ZipCodeExt': textConstructor(employers.Employer?.ZipCodeExt, true),
        },
      };
};

export const mapIndicativeDisputes = (disputes: IIndicativeDisputes) => {
  if (!disputes) return textConstructor(null, true);
  return disputes instanceof Array
    ? disputes.map((d: IIndicativeDisputes) => {
        const mappedAka = mapAka(d.Aka);
        return {
          'data:Aka': mappedAka,
          'data:DeletePreviousAddress': textConstructor(d.DeletePreviousAddress, true),
          'data:PreviousAddress': {
            'data:AddressLine1': textConstructor(d.PreviousAddress.AddressLine1, true),
            'data:AddressLine2': textConstructor(d.PreviousAddress.AddressLine2, true),
            'data:City': textConstructor(d.PreviousAddress.City, true),
            'data:State': textConstructor(d.PreviousAddress.State, true),
            'data:Zipcode': textConstructor(d.PreviousAddress.Zipcode, true),
          },
        };
      })
    : {
        'data:Aka': mapAka(disputes.Aka),
        'data:DeletePreviousAddress': textConstructor(disputes.DeletePreviousAddress, true),
        'data:PreviousAddress': {
          'data:AddressLine1': textConstructor(disputes.PreviousAddress.AddressLine1, true),
          'data:AddressLine2': textConstructor(disputes.PreviousAddress.AddressLine2, true),
          'data:City': textConstructor(disputes.PreviousAddress.City, true),
          'data:State': textConstructor(disputes.PreviousAddress.State, true),
          'data:Zipcode': textConstructor(disputes.PreviousAddress.Zipcode, true),
        },
      };
};

export const mapAka = (aka: IAka | IAka[]) => {
  if (!aka) return textConstructor(null, true);
  return aka instanceof Array
    ? aka.map((a: IAka) => {
        return {
          'data:ValueData': {
            'data:Delete': textConstructor(a.ValueData?.Delete, true),
            'data:Value': textConstructor(a.ValueData?.Value, true),
          },
        };
      })
    : {
        'data:ValueData': {
          'data:Delete': textConstructor(aka.ValueData?.Delete, true),
          'data:Value': textConstructor(aka.ValueData?.Value, true),
        },
      };
};

export const mapLineItems = (items: ILineItem | ILineItem[]) => {
  console.log('startDispute:mapLineItems ===> ', items);
  if (!items) return textConstructor(null, true);
  return items instanceof Array
    ? items.map((item) => {
        const mappedCodes = mapClaimCodes(item.LineItem.ClaimCodes);
        return {
          'data:LineItem': {
            'data:ClaimCodes': mappedCodes,
            'data:CreditReportItem': textConstructor(item.LineItem.CreditReportItem, true),
            'data:LineItemComment': textConstructor(item.LineItem.LineItemComment, true),
            'data:LineItemCommentType': textConstructor(item.LineItem.LineItemCommentType, true),
            'data:UploadDocumentId': textConstructor(item.LineItem.UploadDocumentId, true),
          },
        };
      })
    : {
        'data:LineItem': {
          'data:ClaimCodes': mapClaimCodes(items.LineItem.ClaimCodes),
          'data:CreditReportItem': textConstructor(items.LineItem.CreditReportItem, true),
          'data:LineItemComment': textConstructor(items.LineItem.LineItemComment, true),
          'data:LineItemCommentType': textConstructor(items.LineItem.LineItemCommentType, true),
          'data:UploadDocumentId': textConstructor(items.LineItem.UploadDocumentId, true),
        },
      };
};

export const mapClaimCodes = (codes: IClaimCode | IClaimCode[]) => {
  if (!codes) return textConstructor(null, true);
  return codes instanceof Array
    ? codes.map((code: IClaimCode) => {
        return {
          'data:ClaimCode': {
            'data:Code': textConstructor(code.ClaimCode.Code, true),
          },
        };
      })
    : {
        'data:ClaimCode': {
          'data:Code': textConstructor(codes.ClaimCode.Code, true),
        },
      };
};
/**
 * This method transforms the JSON message to the XML request
 * @param {IStartDispute} msg The packaged message to send in XML format to TU
 * @returns
 */
export const createStartDispute = (msg: IStartDispute): string => {
  // let attachments = msg.request.Attachment;
  // let mappedAttachments = mapAttachments(attachments);

  // let employers = msg.request.Employers;
  // let mappedEmployers = mapEmployers(employers);

  // let indicativeDisputes = msg.request.IndicativeDisputes;
  // let mappedIndicativeDisputes = mapIndicativeDisputes(indicativeDisputes);

  let lineItems = msg.request.LineItems;
  let mappedLineItems = mapLineItems(lineItems);
  console.log('mapped lineitems ==> ', JSON.stringify(mappedLineItems));

  // !!!! May need to add array schema back....see get dispute status
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
        'con:StartDispute': {
          'con:request': {
            'data:AccountCode': textConstructor(msg.request.AccountCode),
            'data:AccountName': textConstructor(msg.request.AccountName),
            'data:RequestKey': textConstructor(`BC-${uuid.v4()}`),
            'data:ClientKey': textConstructor(msg.request.ClientKey),
            // 'data:Attachment': mappedAttachments,
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
              // 'data:DisputePhoneNumber': {
              //   'data:Extension': textConstructor(null, true),
              //   'data:Number': textConstructor(msg.request.Customer.PhoneNumber.slice(-7), true),
              //   'data:AreaCode': textConstructor(msg.request.Customer.PhoneNumber.substring(0, 3), true),
              //   'data:CountryCode': textConstructor('1', true),
              // },
              'data:Identifier': {
                'data:CustomerIdentifier': {
                  'data:Id': textConstructor(msg.request.Customer.Ssn, true),
                  'data:IdentifierType': textConstructor('SocialId', true),
                },
              },
            },
            // 'data:Employers': mappedEmployers,
            'data:EnrollmentKey': textConstructor(msg.request.EnrollmentKey),
            // 'data:IndicativeDisputes': mappedIndicativeDisputes,
            'data:LineItems': mappedLineItems,
            'data:ServiceBundleFulfillmentKey': textConstructor(msg.request.ServiceBundleFulfillmentKey),
            // 'data:ServiceProductFulfillmentKey': textConstructor(msg.request.ServiceProductFulfillmentKey, true),
          },
        },
      },
    },
  };
  console.log('xmlObj ===> ', JSON.stringify(xmlObj));
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};

/**
 * Parse the StartDispute response
 * @param xml
 * @returns IStartDisputeResponse
 */
export const parseStartDispute = (xml: string, options: any): IStartDisputeResponse => {
  const obj: IStartDisputeResponse = returnNestedObject(fastXml.parse(xml, options), 'StartDisputeResponse');
  return obj;
};

/**
 * Take the results from TU and save to db
 * @param data
 * @returns
 */
export const enrichDisputeData = (
  id: string,
  disputes: IProcessDisputeTradelineResult[],
  data: IStartDisputeResult | undefined,
): CreateDisputeInput | undefined => {
  if (!data) return;
  let openedOn = new Date().toISOString();

  const mapped = {
    appDataId: id,
    disputeId: data?.DisputeStatus?.DisputeStatusDetail?.DisputeId,
    disputeStatus: data?.DisputeStatus?.DisputeStatusDetail?.Status,
    disputeLetterCode: data?.DisputeStatus?.DisputeStatusDetail?.LetterStatus.DisputeLetterCode,
    disputeLetterContent: data?.DisputeStatus?.DisputeStatusDetail?.LetterStatus.DisputeLetterContent,
    openDisputes: JSON.stringify(data?.DisputeStatus?.DisputeStatusDetail?.OpenDisputes),
    agencyName: 'TU',
    openedOn: openedOn,
    closedOn: null,
    disputeItems: JSON.stringify(disputes),
    disputeResults: null,
    notificationStatus: null,
    notificationMessage: null,
    notificationSentOn: null,
  };
  console.log('mapped', mapped);
  return mapped;
};
