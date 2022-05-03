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

  generateXMLObject(): void {
    const result = Object.assign({}, this.requestXML);
    Object.entries(this.requestXML).forEach(([key, value]) => {
      const path = (value as string).split('.');
      const val = _.get({ root: this.request }, path);
      if (path.includes('data:Answers')) {
        result[key] = XMLUtil.textConstructor(this.createVerifyAuthenticationAnswerString(val), true);
      } else {
        result[key] = XMLUtil.textConstructor(val, true);
      }
    });
    const unflat = _nest.unflatten(result);
    this.xmlObject = unflat;
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
