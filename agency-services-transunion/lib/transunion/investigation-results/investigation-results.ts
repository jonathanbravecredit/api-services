import { returnNestedObject, updateNestedObject } from 'lib/utils/helpers/helpers';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import * as fastXml from 'fast-xml-parser';
import {
  IGetInvestigationEnrichPayload,
  IGetInvestigationResults,
  IGetInvestigationResultsGraphQLResponse,
  IGetInvestigationResultsMsg,
  IGetInvestigationResultsPayload,
  IGetInvestigationResultsResponse,
} from 'lib/interfaces';
import { DisputeInput, UpdateAppDataInput } from 'src/api/api.service';
import { XmlFormatter } from 'lib/utils/xml-formatter/xml-formatter';

/**
 * Genarates the message payload for TU get dispute history
 * @param data
 * @returns IEnrollPayload
 */
export const createGetInvestigationResultsPayload = ({
  data,
  params,
}: {
  data: IGetInvestigationResultsGraphQLResponse;
  params?: any;
}): IGetInvestigationResultsPayload => {
  const id = data.data.getAppData.id?.split(':')?.pop();
  const key = data.data.getAppData.agencies?.transunion?.disputeEnrollmentKey;

  if (!id || !key) {
    console.log(`no id or enrollmentKey provided: id=${id}, key=${key}`);
    return;
  }

  return {
    RequestKey: '',
    ClientKey: id,
    EnrollmentKey: key,
    DisputeId: params,
  };
};

/**
 * This method packages the message in a request body and adds account information
 * @param {string} accountCode Brave TU account code (can be overriden if passed as part of message)
 * @param {string} accountName Brave TU account name (can be overriden if passed as part of message)
 * @param {IGetInvestigationResultsMsg} msg
 * @returns
 */
export const formatGetInvestigationResults = (
  accountCode: string,
  accountName: string,
  msg: string,
): IGetInvestigationResults | undefined => {
  let message: IGetInvestigationResultsMsg = JSON.parse(msg);
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

/**
 * This method transforms the JSON message to the XML request
 * @param {IGetInvestigationResults} msg The packaged message to send in XML format to TU
 * @returns
 */
export const createGetInvestigationResults = (msg: IGetInvestigationResults): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:GetInvestigationResults': {
          'con:request': {
            'data:AccountCode': XmlFormatter.textConstructor(msg.request.AccountCode),
            'data:AccountName': XmlFormatter.textConstructor(msg.request.AccountName),
            'data:RequestKey': XmlFormatter.textConstructor(`BC-${uuid.v4()}`),
            'data:ClientKey': XmlFormatter.textConstructor(msg.request.ClientKey),
            'data:DisputeId': XmlFormatter.textConstructor(msg.request.DisputeId, true),
            'data:EnrollmentKey': XmlFormatter.textConstructor(msg.request.EnrollmentKey),
          },
        },
      },
    },
  };
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};

/**
 * This method parses and enriches the state data
 * @param {UpdateAppDataInput} data
 * @param {IGetInvestigationResult} getInvestigationResult
 * @returns {UpdateAppDataInput | undefined }
 */
export const enrichGetInvestigationResult = (
  data: UpdateAppDataInput | undefined,
  getInvestigationResult: IGetInvestigationEnrichPayload,
  flag: boolean = false,
): UpdateAppDataInput | undefined => {
  if (!data) return;
  const disputes = data.agencies?.transunion?.disputes;
  if (!disputes?.length) return; // no disputes saved to find
  const updated: DisputeInput[] = disputes.map((dispute) => {
    if (dispute.disputeId == getInvestigationResult.disputeId) {
      return {
        ...dispute,
        disputeCreditBureau: JSON.stringify(getInvestigationResult.getInvestigationResult.CreditBureau),
        disputeInvestigationResults: JSON.stringify(getInvestigationResult.getInvestigationResult.InvestigationResults),
      };
    } else {
      return dispute;
    }
  });
  const mapped = {
    ...data,
    agencies: {
      ...data.agencies,
      transunion: {
        ...data.agencies?.transunion,
        disputes: updated,
      },
    },
  };
  console.log('mapped', mapped.agencies?.transunion.disputes);
  return mapped;
};

/**
 * Parse the Fulfill response including the embedded Service Product Objects
 * @param xml
 * @returns
 */
export const parseInvestigationResults = (xml: string, options: any): any => {
  const obj: IGetInvestigationResultsResponse = fastXml.parse(xml, options);
  const investigationResults = returnNestedObject<string>(obj, 'InvestigationResults');
  const creditBureau = returnNestedObject<string>(obj, 'CreditBureau');

  let results = obj;
  if (typeof investigationResults === 'string') {
    const parsed = fastXml.parse(investigationResults, options);
    console.log('MOCK parsed IR response ==> ', JSON.stringify(parsed));
    results = updateNestedObject(obj, 'InvestigationResults', parsed);
    console.log('MOCK parsed results ==> ', JSON.stringify(results));
  }

  if (typeof creditBureau === 'string') {
    const parsed = fastXml.parse(creditBureau, options);
    console.log('MOCK parsed CB response ==> ', JSON.stringify(parsed));
    results = updateNestedObject(obj, 'CreditBureau', parsed);
    console.log('MOCK parsed results ==> ', JSON.stringify(results));
  }
  return results;
};
