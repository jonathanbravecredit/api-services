import {
  IAka,
  IAttachment,
  IClaimCode,
  IEmployers,
  IIndicativeDisputes,
  ILineItem,
  IStartDispute,
  IStartDisputeBundle,
  IStartDisputeGraphQLResponse,
  IStartDisputeMsg,
  IStartDisputeResponse,
  IDisputeReason,
  IProcessDisputeTradelineResult,
  IProcessDisputePersonalResult,
  IProcessDisputePublicResult,
  IEmployer,
  IBorrowerAddress,
  IBorrowerName,
  IIndicativeDisputesAddress,
  IDisputePersonalItem,
  IDispute,
} from 'lib/interfaces';
import { textConstructor } from 'lib/utils/helpers/helpers';
import * as fastXml from 'fast-xml-parser';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import { MONTH_MAP } from 'lib/data/constants';
import { TransunionUtil } from 'lib/utils/transunion/transunion';
import { DB as db } from 'lib/utils/db/db';
import { UpdateAppDataInput } from 'src/api/api.service';
/**
 * Genarates the message payload for TU Fulfill request
 * TODO: need to incorporate Personal and Public items
 * @param { UpdateAppDataInput} data
 * @returns {IGetDisputeStatusRequest | undefined }
 */
export const createStartDisputeTradelinePayload = ({
  data,
  disputes,
}: {
  data: IStartDisputeGraphQLResponse;
  disputes: IProcessDisputeTradelineResult[];
}): IStartDisputeMsg | undefined => {
  const id = data.data.getAppData.id?.split(':')?.pop();
  const attrs = data.data.getAppData.user?.userAttributes;
  const dob = attrs?.dob;

  if (!id || !attrs || !dob) {
    console.log(`no id, attributes, or dob provided: id=${id},  attrs=${attrs}, dob=${dob}`);
    return;
  }
  console.log('id in Tradeline StartDispute', id);
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
    LineItems: parseDisputeTradelineToLineItem(disputes),
    //not the disputeServiceBundleKey...needs to be the bundle key return with the report returned on
    // either fulfill or enroll calls on the fulfill or enroll report key
    ServiceBundleFulfillmentKey: data.data.getAppData.agencies?.transunion?.serviceBundleFulfillmentKey,
    ServiceProductFulfillmentKey: null,
  };
};

/**
 * Genarates the message payload for TU Fulfill request
 * TODO: need to incorporate Personal and Public items
 * @param { UpdateAppDataInput} data
 * @returns {IGetDisputeStatusRequest | undefined }
 */
export const createStartDisputePublicPayload = ({
  data,
  disputes,
}: {
  data: IStartDisputeGraphQLResponse;
  disputes: IProcessDisputePublicResult[];
}): IStartDisputeMsg | undefined => {
  const id = data.data.getAppData.id?.split(':')?.pop();
  const attrs = data.data.getAppData.user?.userAttributes;
  const dob = attrs?.dob;

  if (!id || !attrs || !dob) {
    console.log(`no id, attributes, or dob provided: id=${id},  attrs=${attrs}, dob=${dob}`);
    return;
  }
  console.log('id in Public StartDispute', id);
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
    LineItems: parseDisputePublicToLineItem(disputes),
    //not the disputeServiceBundleKey...needs to be the bundle key return with the report returned on
    // either fulfill or enroll calls on the fulfill or enroll report key
    ServiceBundleFulfillmentKey: data.data.getAppData.agencies?.transunion?.serviceBundleFulfillmentKey,
    ServiceProductFulfillmentKey: null,
  };
};

export const createStartDisputePersonalPayload = ({
  data,
  disputes,
}: {
  data: IStartDisputeGraphQLResponse;
  disputes: IProcessDisputePersonalResult[];
}): IStartDisputeMsg | undefined => {
  const id = data.data.getAppData.id?.split(':')?.pop();
  const attrs = data.data.getAppData.user?.userAttributes;
  const dob = attrs?.dob;

  if (!id || !attrs || !dob) {
    console.log(`no id, attributes, or dob provided: id=${id},  attrs=${attrs}, dob=${dob}`);
    return;
  }
  console.log('id in Personal StartDispute', id);

  let msg: IStartDisputeMsg = {
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
    LineItems: { LineItem: null }, //parseDisputePublicToLineItem(disputes),
    //not the disputeServiceBundleKey...needs to be the bundle key return with the report returned on
    // either fulfill or enroll calls on the fulfill or enroll report key
    ServiceBundleFulfillmentKey: data.data.getAppData.agencies?.transunion?.serviceBundleFulfillmentKey,
    ServiceProductFulfillmentKey: null,
  };

  const haveEmployers = disputes.findIndex((dispute) => dispute.personalItem.key == 'employer') > -1;
  const haveAddress = disputes.findIndex((dispute) => dispute.personalItem.key == 'address') > -1;
  const haveName = disputes.findIndex((dispute) => dispute.personalItem.key == 'name') > -1;

  console.log('layer checks:employers ===> ', haveEmployers);
  console.log('layer checks:haveAddress ===> ', haveAddress);
  console.log('layer checks:haveName ===> ', haveName);
  console.log('msg before ===> ', msg);

  if (haveEmployers && !(haveAddress || haveName)) msg = layerInEmployers(msg, disputes);
  if (haveAddress && !(haveEmployers || haveName)) msg = layerInAddress(msg, disputes);
  if (haveName && !(haveEmployers || haveAddress)) msg = layerInAka(msg, disputes);

  console.log('msg after ====> ', msg);
  return msg;
};

/**
 * Helper function to parse the disputes to Line Items
 * @param {IProcessDisputeTradelineResult[]} disputes
 * @returns {ILineItem[] | ILineItem}
 */
export const parseDisputeTradelineToLineItem = (
  disputes: IProcessDisputeTradelineResult[],
): ILineItem[] | ILineItem | null => {
  if (!disputes?.length) return null;
  return disputes
    .map((item) => {
      const reasons = item?.result?.data?.reasons;
      const handle = item?.tradeline?.Tradeline?.handle;
      const hasCustomInput = item?.result?.data?.hasCustomInput;
      const customInput = item?.result?.data?.customInput;
      return parserDisputeToLineItem(reasons, handle, hasCustomInput, customInput);
    })
    .filter(Boolean);
};

/**
 * Helper function to parse the disputes to Line Items
 * @param {IProcessDisputePublicResult[]} disputes
 * @returns {ILineItem[] | ILineItem}
 */
export const parseDisputePublicToLineItem = (
  disputes: IProcessDisputePublicResult[],
): ILineItem[] | ILineItem | null => {
  if (!disputes.length) return null;
  return disputes
    .map((item) => {
      const reasons = item?.result?.data?.reasons;
      const handle = item?.publicItem?.PublicRecord.handle;
      const hasCustomInput = item?.result?.data?.hasCustomInput;
      const customInput = item?.result?.data?.customInput;
      return parserDisputeToLineItem(reasons, handle, hasCustomInput, customInput);
    })
    .filter(Boolean);
};

export const parserDisputeToLineItem = (
  reasons: [IDisputeReason, IDisputeReason],
  handle: string,
  hasCustomInput: boolean,
  customInput: string,
) => {
  console.log('parseDisputeToLineItem:reasons ===> ', reasons);
  console.log('parseDisputeToLineItem:handle ===> ', handle);
  console.log('parseDisputeToLineItem:hasCustomInput ===> ', reasons);
  console.log('parseDisputeToLineItem:customInput ===> ', handle);
  if (reasons !== undefined) {
    if (hasCustomInput) {
      return {
        LineItem: {
          ClaimCodes: parseReasonsToClaimCodes(reasons),
          CreditReportItem: handle,
          LineItemComment: customInput || '', // only for C9 disputes
        },
      };
    } else {
      return {
        LineItem: {
          ClaimCodes: parseReasonsToClaimCodes(reasons),
          CreditReportItem: handle,
        },
      };
    }
  }
  return null;
};

/**
 * Helper function to parse the disputes to Line Items
 * @param disputes
 * @returns
 */
export const parseDisputeToEmployer = (disputes: IProcessDisputePersonalResult[]): IEmployers[] => {
  if (!disputes.length) return null;
  return disputes
    .map((item) => {
      const employer: IEmployer = item.personalItem.key === 'employer' ? item.personalItem.value : {};
      return {
        Employer: {
          City: employer?.CreditAddress?.city,
          Delete: 'true',
          Name: employer?.name,
          Occupation: null,
          State: employer?.CreditAddress?.stateCode,
          ZipCode: employer?.CreditAddress?.postalCode,
        },
      };
    })
    .filter(Boolean);
};

export const parseDisputeToAddress = (disputes: IProcessDisputePersonalResult[]): IIndicativeDisputes => {
  if (!disputes.length) return null;
  return disputes.map((item) => {
    const address: IBorrowerAddress = item.personalItem.key === 'address' ? item.personalItem.value : {};
    return {
      Address: {
        AddressLine1: `${address.CreditAddress?.houseNumber || ''} ${address.CreditAddress?.streetName || ''}`,
        AddressLline2: `${address.CreditAddress?.unit || ''}`,
        City: `${address.CreditAddress?.city || ''}`,
        State: `${address.CreditAddress?.stateCode || ''}`,
        Zipcode: `${address.CreditAddress?.postalCode || ''}`,
      },
      DeleteAddress: 'true',
    };
  })[0];
};

export const parseDisputeToAka = (disputes: IProcessDisputePersonalResult[]): any => {
  if (!disputes.length) return null;
  return disputes.map((item) => {
    const name: IBorrowerName = item.personalItem.key === 'name' ? item.personalItem.value : {};
    return {
      Aka: {
        ValueData: {
          Delete: 'true',
          Value: TransunionUtil.nameUnparser(name) || null,
        },
      },
    };
  })[0];
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
  console.log('startDispute:mapIndicativeEnrichment ===> ', disputes);
  if (!disputes) return textConstructor(null, true);
  const results =
    disputes instanceof Array
      ? disputes.map((d: IIndicativeDisputes) => {
          return {
            ...mapAka(d.Aka),
            ...mapAddress(d.Address),
          };
        })
      : {
          ...mapAka(disputes.Aka),
          ...mapAddress(disputes.Address),
        };
  console.log('results in mapIndicativeDispute ===> ', results);
  return results;
};

export const mapAka = (aka: IAka | IAka[]) => {
  console.log('startDispute:mapAka ===> ', aka);
  if (!aka) return { 'data:Aka': textConstructor(null, true) };
  const results =
    aka instanceof Array
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
  console.log('results in mapAka ===> ', results);
  return { 'data:Aka': results };
};

export const mapAddress = (address: IIndicativeDisputesAddress | IIndicativeDisputesAddress[]) => {
  console.log('startDispute:mapAddress ===> ', address);
  if (!address)
    return {
      'data:PreviousAddress': textConstructor(null, true),
    };
  const results =
    address instanceof Array
      ? address.map((a: IIndicativeDisputesAddress) => {
          return {
            'data:PreviousAddress': {
              'data:AddressLine1': textConstructor(a.AddressLine1, true),
              'data:AddressLine2': textConstructor(a.AddressLine2, true),
              'data:City': textConstructor(a.City, true),
              'data:State': textConstructor(a.State, true),
              'data:Zipcode': textConstructor(a.Zipcode, true),
            },
            'data:DeletePreviousAddress': textConstructor('true', false),
          };
        })
      : {
          'data:PreviousAddress': {
            'data:AddressLine1': textConstructor(address.AddressLine1, true),
            'data:AddressLine2': textConstructor(address.AddressLine2, true),
            'data:City': textConstructor(address.City, true),
            'data:State': textConstructor(address.State, true),
            'data:Zipcode': textConstructor(address.Zipcode, true),
          },
          'data:DeletePreviousAddress': textConstructor('true', false),
        };
  console.log('results in mapAddress ===> ', results);
  return results;
};

export const mapLineItems = (items: ILineItem | ILineItem[]) => {
  console.log('startDispute:mapLineItems ===> ', items);
  if (!items) return textConstructor(null, true);
  return items instanceof Array ? items.map((i) => mapLineItem(i)) : mapLineItem(items);
};

export const mapLineItem = (item: ILineItem) => {
  const codes = item.LineItem.ClaimCodes;
  const hasCustom =
    codes instanceof Array
      ? codes.find((c) => c.ClaimCode.Code.toUpperCase() === 'C9')
      : codes.ClaimCode.Code.toUpperCase() === 'C9';
  return hasCustom
    ? {
        'data:LineItem': {
          'data:ClaimCodes': mapClaimCodes(item.LineItem.ClaimCodes),
          'data:CreditReportItem': textConstructor(item.LineItem.CreditReportItem, true),
          'data:LineItemComment': textConstructor(item.LineItem.LineItemComment, true),
          'data:LineItemCommentType': textConstructor(item.LineItem.LineItemCommentType, true),
          'data:UploadDocumentId': textConstructor(item.LineItem.UploadDocumentId, true),
        },
      }
    : {
        'data:LineItem': {
          'data:ClaimCodes': mapClaimCodes(item.LineItem.ClaimCodes),
          'data:CreditReportItem': textConstructor(item.LineItem.CreditReportItem, true),
          'data:UploadDocumentId': textConstructor(item.LineItem.UploadDocumentId, true),
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

  let employers = msg.request.Employers;
  let mappedEmployers = mapEmployers(employers);

  let indicativeDisputes = msg.request.IndicativeDisputes;
  let mappedIndicativeDisputes = mapIndicativeDisputes(indicativeDisputes);
  console.log('mapped mappedIndicativeDisputes ==> ', JSON.stringify(mappedIndicativeDisputes));

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
            'data:AdditionalInputs': {
              'data:Data': {
                'data:Name': textConstructor('DisputeVersion'),
                'data:Value': textConstructor('2'),
              },
            },
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
            'data:Employers': mappedEmployers,
            'data:EnrollmentKey': textConstructor(msg.request.EnrollmentKey),
            'data:IndicativeDisputes': mappedIndicativeDisputes,
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
  console.log('xmlrequest ===> ', xml);
  return xml;
};

/**
 * This method transforms the JSON message to the XML request
 *  - does not contain tradeline/public line items
 * @param {IStartDispute} msg The packaged message to send in XML format to TU
 * @returns
 */
export const createStartDisputePersonal = (msg: IStartDispute): string => {
  // let attachments = msg.request.Attachment;
  // let mappedAttachments = mapAttachments(attachments);

  let employers = msg.request.Employers;
  let mappedEmployers = mapEmployers(employers);

  let indicativeDisputes = msg.request.IndicativeDisputes;
  let mappedIndicativeDisputes = mapIndicativeDisputes(indicativeDisputes);
  console.log('mapped mappedIndicativeDisputes ==> ', JSON.stringify(mappedIndicativeDisputes));

  let lineItems = msg.request.LineItems;
  let mappedLineItems = mapLineItems(lineItems);

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
            'data:AdditionalInputs': {
              'data:Data': {
                'data:Name': textConstructor('DisputeVersion'),
                'data:Value': textConstructor('2'),
              },
            },
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
            'data:Employers': mappedEmployers,
            'data:EnrollmentKey': textConstructor(msg.request.EnrollmentKey),
            'data:IndicativeDisputes': mappedIndicativeDisputes,
            'data:LineItems': {
              'data:LineItem': textConstructor(null, true),
            },
            'data:ServiceBundleFulfillmentKey': textConstructor(msg.request.ServiceBundleFulfillmentKey),
            // 'data:ServiceProductFulfillmentKey': textConstructor(msg.request.ServiceProductFulfillmentKey, true),
          },
        },
      },
    },
  };
  console.log('xmlObj ===> ', JSON.stringify(xmlObj));
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  console.log('xmlrequest ===> ', xml);
  return xml;
};

/**
 * Parse the StartDispute response
 * @param xml
 * @returns IStartDisputeResponse
 */
export const parseStartDispute = (xml: string, options: any): IStartDisputeResponse => {
  const obj: IStartDisputeResponse = fastXml.parse(xml, options);
  return obj;
};

/**
 * Take the results from TU and save to db
 * @param data
 * @returns
 */
export const enrichDisputeData = (
  state: UpdateAppDataInput,
  data: IStartDisputeBundle | undefined,
): UpdateAppDataInput | undefined => {
  // if (!state) return;
  // const { startDisputeResult, disputes } = data;
  // let status = startDisputeResult?.DisputeStatus?.DisputeStatusDetail?.Status;
  // let openedOn = new Date().toISOString();
  // let closedOn =
  //   status.toLowerCase() === 'cancelleddispute' || status.toLowerCase() === 'completedispute' ? openedOn : null;

  // const dispute: IDispute = db.disputes.generators.createDisputeInputRecord(
  //   state.id,
  //   startDisputeResult,
  //   JSON.stringify(disputes),
  //   openedOn,
  //   closedOn,
  // );

  // const oldDisputes = state.agencies?.transunion?.disputes || [];
  // const mapped = {
  //   ...state,
  //   agencies: {
  //     ...state.agencies,
  //     transunion: {
  //       ...state.agencies?.transunion,
  //       disputeStatus: dispute.disputeStatus,
  //       disputeCurrent: dispute,
  //       disputes: [...oldDisputes, dispute].filter(Boolean),
  //     },
  //   },
  // };
  // console.log('mapped', mapped);
  // return mapped;
  return;
};

const layerInEmployers = (msg: IStartDisputeMsg, disputes: IProcessDisputePersonalResult[]): IStartDisputeMsg => {
  return {
    AccountCode: msg.AccountCode,
    AccountName: msg.AccountName,
    RequestKey: msg.RequestKey,
    ClientKey: msg.ClientKey,
    Customer: msg.Customer,
    Employers: parseDisputeToEmployer(disputes) || null,
    EnrollmentKey: msg.EnrollmentKey,
    ServiceBundleFulfillmentKey: msg.ServiceBundleFulfillmentKey,
    ServiceProductFulfillmentKey: msg.ServiceProductFulfillmentKey,
  };
};

const layerInAddress = (msg: IStartDisputeMsg, disputes: IProcessDisputePersonalResult[]): IStartDisputeMsg => {
  return {
    AccountCode: msg.AccountCode,
    AccountName: msg.AccountName,
    RequestKey: msg.RequestKey,
    ClientKey: msg.ClientKey,
    Customer: msg.Customer,
    IndicativeDisputes: parseDisputeToAddress(disputes) || null,
    EnrollmentKey: msg.EnrollmentKey,
    ServiceBundleFulfillmentKey: msg.ServiceBundleFulfillmentKey,
    ServiceProductFulfillmentKey: msg.ServiceProductFulfillmentKey,
  };
};

const layerInAka = (msg: IStartDisputeMsg, disputes: IProcessDisputePersonalResult[]): IStartDisputeMsg => {
  return {
    AccountCode: msg.AccountCode,
    AccountName: msg.AccountName,
    RequestKey: msg.RequestKey,
    ClientKey: msg.ClientKey,
    Customer: msg.Customer,
    IndicativeDisputes: parseDisputeToAka(disputes) || null,
    EnrollmentKey: msg.EnrollmentKey,
    ServiceBundleFulfillmentKey: msg.ServiceBundleFulfillmentKey,
    ServiceProductFulfillmentKey: msg.ServiceProductFulfillmentKey,
  };
};
