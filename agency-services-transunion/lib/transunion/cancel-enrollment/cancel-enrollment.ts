import { textConstructor } from 'lib/utils/helpers/helpers';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import {
  ICancelEnroll,
  ICancelEnrollGraphQLResponse,
  ICancelEnrollPayload,
} from 'lib/interfaces/transunion/cancel-enrollment.interface';

/**
 * Genarates the message payload for TU Enroll service
 * @param data
 * @returns IEnrollPayload
 */
export const createCancelEnrollmentPayload = (data: ICancelEnrollGraphQLResponse): ICancelEnrollPayload => {
  const id = data.data.getAppData?.id?.split(':')?.pop();
  const key = data.data.getAppData?.agencies?.transunion?.enrollmentKey;
  if (!id || !key) {
    console.log(`no id or key provided: id=${id},  key=${key}`);
    return;
  }

  return {
    RequestKey: '', // gets added below
    AdditionalInputs: {
      Data: {
        Name: 'CreditReportVersion',
        Value: '7.1',
      },
    },
    ClientKey: id,
    EnrollmentKey: key,
  };
};

/**
 * Add the header information to the formated payload
 * @param accountCode
 * @param accountName
 * @param msg
 * @returns
 */
export const formatCancelEnroll = (
  accountCode: string,
  accountName: string,
  msg: string,
): ICancelEnroll | undefined => {
  let message: ICancelEnrollPayload = JSON.parse(msg);
  // consider adding validation here
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
export const createCancelEnroll = (msg: ICancelEnroll): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:CancelEnrollment': {
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
            'data:EnrollmentKey': textConstructor(msg.request.EnrollmentKey),
          },
        },
      },
    },
  };
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};

// /**
//  * Parse the Enroll response including the embedded Service Product Objects
//  * @param xml
//  * @returns
//  */
// export const parseCancelEnroll = (xml: string, options: any): IEnrollResponse => {
//   const obj: IEnrollResponse = fastXml.parse(xml, options);
//   const resp = returnNestedObject<any>(obj, 'ServiceProductResponse');
//   if (resp instanceof Array) {
//     const mapped = resp.map((prod) => {
//       let prodObj = prod['ServiceProductObject']['#text'];
//       if (typeof prodObj === 'string') {
//         // two decodes, because comes in encoded, and our defualt parser options encode it again.
//         let clean = he.decode(he.decode(prodObj));
//         const parsed = fastXml.parse(clean, options);
//         return {
//           ...prod,
//           ServiceProductObject: parsed,
//         };
//       } else {
//         return prod;
//       }
//     });
//     const updated = updateNestedObject(obj, 'ServiceProductResponse', [...mapped.filter(Boolean)]);
//     return updated ? updated : obj;
//   } else {
//     return obj;
//   }
// };

// /**
//  * This method parses and enriches the state data
//  * @param {UpdateAppDataInput} data
//  * @param {IEnrollResponse} enroll
//  * @returns
//  */
// export const enrichEnrollmentData = (
//   data: UpdateAppDataInput | undefined,
//   enroll: IEnrollResult,
// ): UpdateAppDataInput | undefined => {
//   if (!data) return;
//   let enrollReport: IEnrollServiceProductResponse | undefined;
//   let enrollMergeReport: IEnrollServiceProductResponse | undefined;
//   let enrollVantageScore: IEnrollServiceProductResponse | undefined;
//   let enrolledOn = new Date().toISOString();
//   const enrollmentKey = enroll.EnrollmentKey;
//   const serviceBundleFulfillmentKey = enroll.ServiceBundleFulfillmentKey;
//   const prodResponse = enroll.ServiceProductFulfillments.ServiceProductResponse;
//   console.log('enroll enrollmentkey ===> ', JSON.stringify(enrollmentKey));
//   console.log('enroll serviceBundleFulfillmentKey ===> ', JSON.stringify(serviceBundleFulfillmentKey));
//   console.log('enroll prodResponse ===> ', JSON.stringify(prodResponse));
//   if (!prodResponse) return;
//   if (prodResponse instanceof Array) {
//     enrollReport = prodResponse.find((item: IEnrollServiceProductResponse) => {
//       return item['ServiceProduct'] === 'TUCReport';
//     });
//     enrollMergeReport = prodResponse.find((item: IEnrollServiceProductResponse) => {
//       return item['ServiceProduct'] === 'MergeCreditReports';
//     });
//     enrollVantageScore = prodResponse.find((item: IEnrollServiceProductResponse) => {
//       return item['ServiceProduct'] === 'TUCVantageScore3';
//     });
//   } else {
//     switch (prodResponse['ServiceProduct']) {
//       case 'TUCReport':
//         enrollReport = prodResponse || null;
//         break;
//       case 'MergeCreditReports':
//         enrollMergeReport = prodResponse || null;
//         break;
//       case 'TUCVantageScore3':
//         enrollVantageScore = prodResponse || null;
//         break;
//       default:
//         break;
//     }
//   }

//   //when first enrolling, enrollment reports are the same as fulfillment reports
//   return {
//     ...data,
//     agencies: {
//       ...data.agencies,
//       transunion: {
//         ...data.agencies?.transunion,
//         enrolled: true,
//         enrolledOn: enrolledOn,
//         enrollmentKey: enrollmentKey,
//         enrollReport: mapReportResponse(enrollReport),
//         enrollMergeReport: mapReportResponse(enrollMergeReport),
//         enrollVantageScore: mapReportResponse(enrollVantageScore),
//         fulfilledOn: enrolledOn,
//         fulfillReport: mapReportResponse(enrollReport),
//         fulfillMergeReport: mapReportResponse(enrollMergeReport),
//         fulfillVantageScore: mapReportResponse(enrollVantageScore),
//         serviceBundleFulfillmentKey: serviceBundleFulfillmentKey, // this always has to be synced to the report in fulfill fields
//       },
//     },
//   };
// };
