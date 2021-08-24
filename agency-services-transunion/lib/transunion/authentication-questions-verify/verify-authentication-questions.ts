import { textConstructor } from 'lib/utils/helpers/helpers';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import {
  IVerifyAuthenticationQuestions,
  IVerifyAuthenticationAnswer,
  IVerifyAuthenticationQuestionsPayload,
} from 'lib/interfaces';

export const formatVerifyAuthenticationQuestions = (
  accountCode: string,
  accountName: string,
  msg: IVerifyAuthenticationQuestionsPayload,
): IVerifyAuthenticationQuestions | undefined => {
  return {
    request: {
      AccountCode: accountCode,
      AccountName: accountName,
      RequestKey: '',
      ClientKey: msg.id,
      Answers: msg.answers,
      ServiceBundleFulfillmentKey: msg.key,
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
    .join();
  return `<ArrayOfVerifyChallengeAnswersRequestMultiChoiceQuestion xmlns="com/truelink/ds/sch/srv/iv/ccs">${answersString}</ArrayOfVerifyChallengeAnswersRequestMultiChoiceQuestion>`;
};
