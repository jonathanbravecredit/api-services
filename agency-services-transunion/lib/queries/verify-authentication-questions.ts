import { cdataConstructor, textConstructor } from 'lib/utils/helpers';
import * as convert from 'xml-js';
import * as uuid from 'uuid';
import {
  IVerifyAuthenticationQuestions,
  IVerifyAuthenticationQuestionsMsg,
} from 'lib/interfaces/verify-authentication-questions.interface';
import { IVerifyAuthenticationAnswersArray } from 'lib/interfaces/verify-authentication-answers.interface';

export const formatVerifyAuthenticationQuestions = (
  accountCode: string,
  accountName: string,
  msg: string,
): IVerifyAuthenticationQuestions | undefined => {
  let message: IVerifyAuthenticationQuestionsMsg = JSON.parse(msg);
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
        'con:GetAuthenticationQuestions': {
          'con:request': {
            'data:AccountCode': textConstructor(msg.request.AccountCode),
            'data:AccountName': textConstructor(msg.request.AccountName),
            'data:RequestKey': textConstructor(uuid.v4()),
            'data:ClientKey': textConstructor(msg.request.ClientKey),
            'data:Answers': cdataConstructor(createVerifyAuthenticationAnswerString(msg.request.Answers)),
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

export const createVerifyAuthenticationAnswerString = (answers: IVerifyAuthenticationAnswersArray): string => {
  const answersString = answers.ArrayOfVerifyChallengeAnswersRequestMultiChoiceQuestion.map((a) => {
    return `
    <VerifyChallengeAnswersRequestMultiChoiceQuestion>
      <QuestionId>${a?.VerifyChallengeAnswersRequestMultiChoiceQuestion?.QuestionId || ''}</QuestionId>
      <SelectedAnswerChoice>
        <AnswerChoiceId>${
          a?.VerifyChallengeAnswersRequestMultiChoiceQuestion?.SelectedAnswerChoice?.AnswerChoiceId || ''
        }</AnswerChoiceId>
      </SelectedAnswerChoice>
    </VerifyChallengeAnswersRequestMultiChoiceQuestion>
    `;
  }).join();
  return `<ArrayOfVerifyChallengeAnswersRequestMultiChoiceQuestion xmlns="com/truelink/ds/sch/srv/iv/ccs">${answersString}</ArrayOfVerifyChallengeAnswersRequestMultiChoiceQuestion>`;
};
