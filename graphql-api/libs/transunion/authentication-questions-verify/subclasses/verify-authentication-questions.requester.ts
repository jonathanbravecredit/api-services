import { IVerifyAuthenticationAnswer } from 'libs/interfaces/transunion/verify-authentication-answers.interface';
import { APIRequester } from 'libs/models/api-requester.model';
import { IVerifyAuthenticationQuestionsPayload } from 'libs/transunion/authentication-questions-verify/verify-authentication-questions.interface';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { Nested as _nest } from 'libs/utils/helpers/Nested';
import { XMLUtil } from 'libs/utils/xml/XMLUtil';
import * as _ from 'lodash';

export class VerifyAuthenticationQuestionsRequester
  extends TURequester<IVerifyAuthenticationQuestionsPayload>
  implements APIRequester
{
  constructor(requestKey: APIRequestKeys, payload: IVerifyAuthenticationQuestionsPayload) {
    super(requestKey, payload);
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
      .join();
    return `<ArrayOfVerifyChallengeAnswersRequestMultiChoiceQuestion xmlns="com/truelink/ds/sch/srv/iv/ccs">${answersString}</ArrayOfVerifyChallengeAnswersRequestMultiChoiceQuestion>`;
  };
}