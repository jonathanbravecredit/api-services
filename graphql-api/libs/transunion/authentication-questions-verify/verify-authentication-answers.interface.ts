export interface IVerifyAuthenticationAnswersArray {
  ArrayOfVerifyChallengeAnswersRequestMultiChoiceQuestion: IVerifyAuthenticationAnswer[];
}

export interface IVerifyAuthenticationAnswer {
  VerifyChallengeAnswersRequestMultiChoiceQuestion: {
    QuestionId: number;
    SelectedAnswerChoice: {
      AnswerChoiceId: number;
      UserInputAnswer?: string;
    };
  };
}
