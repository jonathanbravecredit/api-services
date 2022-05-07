import { IVerifyAuthenticationAnswer } from 'libs/transunion/authentication-questions-verify/verify-authentication-answers.interface';
import { APIRequester } from 'libs/models/api-requester.model';
import { IVerifyAuthenticationQuestionsSchema } from 'libs/transunion/authentication-questions-verify/verify-authentication-questions.interface';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { Nested as _nest } from '@bravecredit/brave-sdk';
import { XMLUtil } from 'libs/utils/xml/XMLUtil';
import * as _ from 'lodash';
import { v4 } from 'uuid';
import { ACCOUNT_CODE, ACCOUNT_NAME } from 'libs/data/constants';

export class VerifyAuthenticationQuestionsRequester
  extends TURequester<IVerifyAuthenticationQuestionsSchema>
  implements APIRequester
{
  constructor(requestKey: APIRequestKeys, payload: IVerifyAuthenticationQuestionsSchema) {
    super(requestKey, payload);
    _.bindAll(this, ['createVerifyAuthenticationAnswerString']);
  }

  parseXML(obj: any): any {
    if (!this.requestObject || !Object.keys(this.requestObject).length) return {};
    _.entries(this.requestXMLMap).forEach(([key, value]) => {
      const path = String(value).split('.');
      const val = _.get({ root: this.requestObject }, path);
      obj[key] = path.includes('data:Answers')
        ? XMLUtil.textConstructor(this.createVerifyAuthenticationAnswerString(val), true)
        : XMLUtil.textConstructor(val, true);
    });
    return obj;
  }

  createVerifyAuthenticationAnswerString = (answers: IVerifyAuthenticationAnswer[]): string => {
    const answersString = answers
      .map((a) => {
        let questionId = a?.VerifyChallengeAnswersRequestMultiChoiceQuestion?.QuestionId;
        let answerChoiceId = a?.VerifyChallengeAnswersRequestMultiChoiceQuestion?.SelectedAnswerChoice?.AnswerChoiceId;
        let userInputAnswer =
          a?.VerifyChallengeAnswersRequestMultiChoiceQuestion?.SelectedAnswerChoice?.UserInputAnswer;
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

  getReqWrapper(body: any): any {
    return {
      AccountCode: ACCOUNT_CODE,
      AccountName: ACCOUNT_NAME,
      RequestKey: `BC-${v4()}`,
      ...body,
    };
  }
}
