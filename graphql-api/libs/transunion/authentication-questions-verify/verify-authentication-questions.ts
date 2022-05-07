import { textConstructor } from 'libs/utils/helpers/helpers';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import {
  IVerifyAuthenticationQuestions,
  IVerifyAuthenticationQuestionsPayload,
  IVerifyAuthenticationQuestionsResponse,
} from 'libs/transunion/authentication-questions-verify/verify-authentication-questions.interface';
import { IVerifyAuthenticationAnswer } from 'libs/transunion/authentication-questions-verify/verify-authentication-answers.interface';
import { IErrorResponse, INil } from '@bravecredit/brave-sdk';
import { SoapAid } from 'libs/utils/soap-aid/soap-aid';
import * as he from 'he';
import * as https from 'https';
import * as fastXml from 'fast-xml-parser';
import * as interfaces from 'libs/interfaces';
import { ajv } from 'libs/schema/validation';
import ErrorLogger from 'libs/utils/db/logger/logger-errors';
import TransactionLogger from 'libs/utils/db/logger/logger-transactions';

const errorLogger = new ErrorLogger();
const transactionLogger = new TransactionLogger();
const parserOptions = {
  attributeNamePrefix: '',
  ignoreAttributes: false,
  ignoreNameSpace: true,
  parseAttributeValue: true,
  attrValueProcessor: (val, attrName) => he.encode(val, { isAttributeValue: true }), //default is a=>a
  tagValueProcessor: (val, tagName) => he.encode(val), //default is a=>a
};

export const formatVerifyAuthenticationQuestions = (
  accountCode: string,
  accountName: string,
  msg: string,
): IVerifyAuthenticationQuestions | undefined => {
  const parsed: IVerifyAuthenticationQuestionsPayload = JSON.parse(msg);
  return {
    request: {
      AccountCode: accountCode,
      AccountName: accountName,
      RequestKey: '',
      ClientKey: parsed.id,
      Answers: parsed.answers,
      ServiceBundleFulfillmentKey: parsed.key,
    },
  };
};

/**
 * Creates the JSON object the XML parser expects
 * @param {IVerifyAuthenticationQuestions} msg
 * @returns
 */
export const createVerifyAuthenticationQuestions = (msg: IVerifyAuthenticationQuestions): string => {
  const xmlObj = {
    'soapenv:Envelope': {
      _attributes: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
        'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
      },
      'soapenv:Header': {},
      'soapenv:Body': {
        'con:VerifyAuthenticationQuestions': {
          'con:request': {
            'data:AccountCode': textConstructor(msg.request.AccountCode),
            'data:AccountName': textConstructor(msg.request.AccountName),
            'data:RequestKey': textConstructor(`BC-${uuid.v4()}`),
            'data:ClientKey': textConstructor(msg.request.ClientKey),
            'data:Answers': textConstructor(createVerifyAuthenticationAnswerString(msg.request.Answers)),
            'data:ServiceBundleFulfillmentKey': textConstructor(msg.request.ServiceBundleFulfillmentKey),
            'data:TrustSessionId': textConstructor(msg.request.TrustSessionId),
          },
        },
      },
    },
  };
  const xml = convert.json2xml(JSON.stringify(xmlObj), { compact: true, spaces: 4 });
  return xml;
};

/**
 * Creates the xml structure to be passed as part of the CDATA
 * @param {IVerifyAuthenticationAnswer} answers
 * @returns
 */
export const createVerifyAuthenticationAnswerString = (answers: IVerifyAuthenticationAnswer[]): string => {
  const answersString = answers
    .map((a) => {
      let questionId = a?.VerifyChallengeAnswersRequestMultiChoiceQuestion?.QuestionId;
      let answerChoiceId = a?.VerifyChallengeAnswersRequestMultiChoiceQuestion?.SelectedAnswerChoice?.AnswerChoiceId;
      let userInputAnswer = a?.VerifyChallengeAnswersRequestMultiChoiceQuestion?.SelectedAnswerChoice?.UserInputAnswer;
      return `<VerifyChallengeAnswersRequestMultiChoiceQuestion>
            <QuestionId>${questionId || ''}</QuestionId>
            <SelectedAnswerChoice>
              <AnswerChoiceId>${answerChoiceId || ''}</AnswerChoiceId>
              ${userInputAnswer ? `<UserInputAnswer>${userInputAnswer}</UserInputAnswer>` : ''}
            </SelectedAnswerChoice>
          </VerifyChallengeAnswersRequestMultiChoiceQuestion>
          `;
    })
    .join('');
  return `<ArrayOfVerifyChallengeAnswersRequestMultiChoiceQuestion xmlns="com/truelink/ds/sch/srv/iv/ccs">${answersString}</ArrayOfVerifyChallengeAnswersRequestMultiChoiceQuestion>`;
};

/**
 * Sends the OTP or KBA answers to TU to verify
 * @param {string} accountCode Brave account code
 * @param {string} username Brave user ID (Identity ID)
 * @param {string} message JSON object in Verify message format...TODO add type definitions for
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const VerifyAuthenticationQuestions = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error: IErrorResponse | INil;
  data: any;
}> => {
  const payload: IVerifyAuthenticationQuestionsPayload = {
    id: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<IVerifyAuthenticationQuestionsPayload>('verifyAuthenticationQuestionsRequest');
  if (!validate(payload)) throw `Malformed message=${message}`;
  //create helper classes
  const soap = new SoapAid(fastXml.parse, formatVerifyAuthenticationQuestions, createVerifyAuthenticationQuestions);

  try {
    const resp = await soap.parseAndSendPayload<IVerifyAuthenticationQuestionsResponse>(
      accountCode,
      username,
      agent,
      auth,
      payload,
      'VerifyAuthenticationQuestions',
      parserOptions,
    );

    const data = resp.Envelope?.Body?.VerifyAuthenticationQuestionsResponse?.VerifyAuthenticationQuestionsResult;
    const responseType = data?.ResponseType;
    const error = data?.ErrorResponse;

    // log tu responses
    const l1 = transactionLogger.createTransaction(
      identityId,
      'VerifyAuthenticationQuestions:data',
      JSON.stringify(data),
    );
    const l2 = transactionLogger.createTransaction(
      identityId,
      'VerifyAuthenticationQuestions:type',
      JSON.stringify(responseType),
    );
    const l3 = transactionLogger.createTransaction(
      identityId,
      'VerifyAuthenticationQuestions:error',
      JSON.stringify(error),
    );
    await transactionLogger.logger.create(l1);
    await transactionLogger.logger.create(l2);
    await transactionLogger.logger.create(l3);

    const response =
      responseType.toLowerCase() === 'success'
        ? { success: true, error: error, data: data }
        : { success: false, error: error, data: null };

    // log success response
    const l4 = transactionLogger.createTransaction(
      identityId,
      'VerifyAuthenticationQuestions:response',
      JSON.stringify(response),
    );
    await transactionLogger.logger.create(l4);

    return response;
  } catch (err) {
    // log error response
    const error = errorLogger.createError(identityId, 'VerifyAuthenticationQuestions', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err, data: null };
  }
};
