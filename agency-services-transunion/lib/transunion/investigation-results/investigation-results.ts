import { returnNestedObject, updateNestedObject } from 'lib/utils/helpers/helpers';
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
} from 'lib/interfaces';
import { DisputeInput, UpdateAppDataInput } from 'src/api/api.service';
import { XmlFormatter } from 'lib/utils/xml-formatter/xml-formatter';
import { DB as db } from 'lib/utils/db/db';

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
  // now only going to save the id's
  const sub = data.id;
  const cbID = uuid.v4();
  const irID = uuid.v4();
  const irReport = getInvestigationResult.getInvestigationResult.InvestigationResults;
  const cbReport = getInvestigationResult.getInvestigationResult.CreditBureau;
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

  // get investigation results, should be only on the current dispute...this will be the new process
  const currentDispute = data.agencies?.transunion?.disputeCurrent;
  // update the disputes table
  db.disputes.updateResults(sub, currentDispute.disputeId, JSON.stringify({ id: cbID }), JSON.stringify({ id: irID }));
  // this goes through and finds the matching dispute in the dispute list...it should be the current dispute, but not 100% on this.
  const updated: DisputeInput[] = disputes.map((dispute) => {
    if (dispute.disputeId == getInvestigationResult.disputeId) {
      return {
        ...dispute,
        disputeCreditBureau: JSON.stringify({ id: cbID }),
        disputeInvestigationResults: JSON.stringify({ id: irID }),
      };
    } else {
      return dispute;
    }
  });
  const disputeId = getInvestigationResult.disputeId;
  if (currentDispute && currentDispute.disputeId === disputeId) {
    // the current dispute is the same one with investigation results
    // ...this should always be the case...and the current dispute should not move out
    // until there is a new dispute created...in which case the next time a dispute
    // has investigation results it will be for the new current dispute
    // db.disputes.update()
    const mapped: UpdateAppDataInput = {
      ...data,
      agencies: {
        ...data.agencies,
        transunion: {
          ...data.agencies?.transunion,
          disputeCurrent: {
            ...currentDispute,
            disputeCreditBureau: JSON.stringify({ id: cbID }),
            disputeInvestigationResults: JSON.stringify({ id: irID }),
          },
          disputes: updated,
        },
      },
    };
    console.log('mapped', mapped.agencies?.transunion.disputes);
    return mapped;
  } else {
    const mapped: UpdateAppDataInput = {
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
    console.log('MOCK parsed IR response ==> ', JSON.stringify(parsed));
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
    console.log('MOCK parsed CB response ==> ', JSON.stringify(parsed));
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
  console.log('MOCK parsed results ==> ', JSON.stringify(results));
  return results;
};
