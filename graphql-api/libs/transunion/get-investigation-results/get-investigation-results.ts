import { returnNestedObject, updateNestedObject } from 'libs/utils/helpers/helpers';
import * as convert from 'xml-js';
import * as he from 'he';
import * as uuid from 'uuid';
import * as fastXml from 'fast-xml-parser';
import {
  IGetInvestigationEnrichPayload,
  IGetInvestigationResults,
  IGetInvestigationResultsGraphQLResponse,
  IGetInvestigationResultsMsg,
  IGetInvestigationResultsPayload,
  IGetInvestigationResultsResponse,
} from 'libs/interfaces';
import { UpdateAppDataInput } from 'src/api/api.service';
import { XMLUtil as XML } from 'libs/utils/xml/XMLUtil';
import { DB as db } from 'libs/utils/db/db';

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
            'data:AccountCode': XML.textConstructor(msg.request.AccountCode),
            'data:AccountName': XML.textConstructor(msg.request.AccountName),
            'data:RequestKey': XML.textConstructor(`BC-${uuid.v4()}`),
            'data:ClientKey': XML.textConstructor(msg.request.ClientKey),
            'data:DisputeId': XML.textConstructor(msg.request.DisputeId, true),
            'data:EnrollmentKey': XML.textConstructor(msg.request.EnrollmentKey),
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
  // now only going to save the id's
  const sub = data.id;
  const cbID = uuid.v4();
  const irID = uuid.v4();
  const irReport = getInvestigationResult.getInvestigationResult.InvestigationResults;
  const cbReport = getInvestigationResult.getInvestigationResult.CreditBureau;
  const disputeId = getInvestigationResult.disputeId;
  const newIR = {
    id: irID,
    userId: sub,
    record: JSON.stringify(irReport),
    createdOn: null,
    modifiedOn: null,
  };
  db.investigationResults.create(newIR);

  const newCB = {
    id: cbID,
    userId: sub,
    record: JSON.stringify(cbReport),
    createdOn: null,
    modifiedOn: null,
  };
  db.creditBureauResults.create(newCB);
  // update the disputes table with IR and CB ids.
  db.disputes.updateResults(sub, disputeId, cbID, irID);
  return data;
};

/**
 * Update the investigation and credity bureau tables directly with the results
 * - Replaces the enricher as this no longer holds the disputes
 * @param id
 * @param data
 * @returns
 */
export const updateInvestigationResultsDB = async (id: string, data: IGetInvestigationEnrichPayload): Promise<any> => {
  if (!data) return;
  const sub = id;
  const cbID = uuid.v4();
  const irID = uuid.v4();
  const irReport = data.getInvestigationResult.InvestigationResults;
  const cbReport = data.getInvestigationResult.CreditBureau;
  const disputeId = data.disputeId;
  const newIR = {
    id: irID,
    userId: sub,
    record: JSON.stringify(irReport),
    createdOn: null,
    modifiedOn: null,
  };

  const newCB = {
    id: cbID,
    userId: sub,
    record: JSON.stringify(cbReport),
    createdOn: null,
    modifiedOn: null,
  };

  try {
    await db.investigationResults.create(newIR);
    await db.creditBureauResults.create(newCB);
    await db.disputes.updateResults(sub, disputeId, cbID, irID);
    return true;
  } catch (err) {
    console.log('updateInvestigationResultsDB error ===> ', err);
    return false;
  }
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
    let clean = he.decode(he.decode(investigationResults));
    const parsed = fastXml.parse(clean, options);
    console.log('parsed IR response ==> ', JSON.stringify(parsed));
    const resultsResults = results.Envelope?.Body?.GetInvestigationResultsResponse?.GetInvestigationResultsResult;
    results = {
      ...results,
      Envelope: {
        Body: {
          GetInvestigationResultsResponse: {
            GetInvestigationResultsResult: {
              ...resultsResults,
              InvestigationResults: parsed,
            },
          },
        },
      },
    };
  }

  if (typeof creditBureau === 'string') {
    let clean = he.decode(he.decode(creditBureau));
    const parsed = fastXml.parse(clean, options);
    console.log('parsed CB response ==> ', JSON.stringify(parsed));
    const resultsResults = results.Envelope?.Body?.GetInvestigationResultsResponse?.GetInvestigationResultsResult;
    results = {
      ...results,
      Envelope: {
        Body: {
          GetInvestigationResultsResponse: {
            GetInvestigationResultsResult: {
              ...resultsResults,
              CreditBureau: parsed,
            },
          },
        },
      },
    };
  }
  console.log('parsed results ==> ', JSON.stringify(results));
  return results;
};
