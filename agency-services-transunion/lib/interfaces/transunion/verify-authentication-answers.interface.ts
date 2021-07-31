export interface IVerifyAuthenticationAnswersArray {
  ArrayOfVerifyChallengeAnswersRequestMultiChoiceQuestion: IVerifyAuthenticationAnswer[];
}

export interface IVerifyAuthenticationAnswer {
  VerifyChallengeAnswersRequestMultiChoiceQuestion: {
    QuestionId: string;
    SelectedAnswerChoice: {
      AnswerChoiceId: string;
      UserInputAnswer?: string;
    };
  };
}
