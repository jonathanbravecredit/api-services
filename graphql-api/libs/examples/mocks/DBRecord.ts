export const GQL_TEST = {
  data: {
    getAppData: {
      __typename: 'AppData',
      agencies: {
        equifax: {
          authenticated: false,
        },
        experian: {
          authenticated: false,
        },
        transunion: {
          acknowledgedDisputeTerms: true,
          acknowledgedDisputeTermsOn: '2021-07-18T18:00:11.454Z',
          authenticated: false,
          currentRawAuthDetails: null,
          currentRawQuestions:
            '&lt;?xml version="1.0" encoding="utf-8"?&gt;&#xD;\n&lt;VerifyChallengeAnswersResponseSuccess xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="com/truelink/ds/sch/srv/iv/ccs"&gt;&#xD;\n  &lt;ApplicantChallengeId&gt;878812904&lt;/ApplicantChallengeId&gt;&#xD;\n  &lt;AnswerVerificationStatus&gt;InProgress&lt;/AnswerVerificationStatus&gt;&#xD;\n  &lt;ChallengeConfiguration&gt;&#xD;\n    &lt;RulesApp&gt;IDMA&lt;/RulesApp&gt;&#xD;\n    &lt;CorrectAnswersNeeded&gt;0&lt;/CorrectAnswersNeeded&gt;&#xD;\n    &lt;AnswerAttemptsAllowed&gt;0&lt;/AnswerAttemptsAllowed&gt;&#xD;\n    &lt;MultiChoiceQuestion&gt;&#xD;\n      &lt;QuestionType&gt;IDMA&lt;/QuestionType&gt;&#xD;\n      &lt;SequenceNumber&gt;1&lt;/SequenceNumber&gt;&#xD;\n      &lt;LastChanceQuestion&gt;false&lt;/LastChanceQuestion&gt;&#xD;\n      &lt;FakeQuestion&gt;false&lt;/FakeQuestion&gt;&#xD;\n      &lt;FullQuestionText&gt;Enter the passcode you received&lt;/FullQuestionText&gt;&#xD;\n      &lt;KeyQuestionText&gt;&#xD;\n        &lt;PromptDate&gt;2021-07-18T09:33:42-07:00&lt;/PromptDate&gt;&#xD;\n      &lt;/KeyQuestionText&gt;&#xD;\n      &lt;AnswerChoice&gt;&#xD;\n        &lt;SequenceNumber&gt;1&lt;/SequenceNumber&gt;&#xD;\n        &lt;IsCorrectAnswer&gt;false&lt;/IsCorrectAnswer&gt;&#xD;\n        &lt;AnswerChoiceText&gt;Enter the passcode you received&lt;/AnswerChoiceText&gt;&#xD;\n        &lt;Key&gt;USER_TO_INPUT_PIN&lt;/Key&gt;&#xD;\n        &lt;AnswerChoiceId&gt;3083869970&lt;/AnswerChoiceId&gt;&#xD;\n      &lt;/AnswerChoice&gt;&#xD;\n      &lt;Key&gt;IDM_PINVERIFY&lt;/Key&gt;&#xD;\n      &lt;QuestionId&gt;49996238&lt;/QuestionId&gt;&#xD;\n    &lt;/MultiChoiceQuestion&gt;&#xD;\n    &lt;ApplicantChallengeId&gt;878812904&lt;/ApplicantChallengeId&gt;&#xD;\n    &lt;ApplicantId&gt;35651536&lt;/ApplicantId&gt;&#xD;\n  &lt;/ChallengeConfiguration&gt;&#xD;\n&lt;/VerifyChallengeAnswersResponseSuccess&gt;',
          disputeEnrolled: true,
          disputeEnrolledOn: '2021-07-18T18:29:32.093Z',
          disputeEnrollmentKey: 'db73073c-86ac-46ab-a31c-47855d237e28',
          disputes: null,
          disputeServiceBundleFulfillmentKey: '8426ca08-b076-4bfc-89f2-bf3f855e1619',
          disputeStatus: null,
          enrolled: true,
          enrolledOn: '2021-07-18T16:33:47.134Z',
          enrollmentKey: 'c7cb7f92-223a-4588-ab1e-2013ed80c798',
          enrollMergeReport: {
            bureau: 'TransUnion',
            errorResponse: '{nil=true}',
            serviceProduct: 'MergeCreditReports',
            serviceProductFullfillmentKey: '',
            serviceProductObject: null,
            serviceProductTypeId: 'CreditReport',
            serviceProductValue: '',
            status: 'Success',
          },
          enrollReport: null,
          enrollVantageScore: {
            bureau: 'TransUnion',
            errorResponse: '{nil=true}',
            serviceProduct: 'TUCVantageScore3',
            serviceProductFullfillmentKey: '2c234255-97cb-4dce-8981-e7fba474d9d4',
            serviceProductObject: null,
            serviceProductTypeId: 'VantageScore',
            serviceProductValue: '502',
            status: 'Success',
          },
          fulfilledOn: '2021-07-19T18:17:06.941Z',
          fulfillMergeReport: {
            bureau: 'TransUnion',
            errorResponse: 'true',
            serviceProduct: 'MergeCreditReports',
            serviceProductFullfillmentKey: '',
            serviceProductObject: null,
            serviceProductTypeId: 'CreditReport',
            serviceProductValue: '',
            status: 'Success',
          },
          fulfillReport: null,
          fulfillVantageScore: null,
          getAuthenticationQuestionsSuccess: true,
          indicativeEnrichmentSuccess: true,
          serviceBundleFulfillmentKey: '1a0d174a-2f5a-4e86-9406-3e2cb4d52453',
        },
      },
      createdAt: '2021-07-18T16:32:31.784Z',
      id: 'us-east-2:fc02d26c-516e-453a-b18b-729000d1be39',
      owner: 'aa15bc48-6f71-4952-bc9d-ed6c932fe440',
      preferences: {
        showAllAccounts: {
          collectionsAccounts: true,
          creditCards: true,
          installmentLoans: true,
          mortgages: true,
        },
      },
      updatedAt: '2021-07-19T18:17:07.242Z',
      user: {
        id: 'us-east-2:fc02d26c-516e-453a-b18b-729000d1be39',
        onboarding: {
          lastActive: 3,
          lastComplete: 3,
          started: true,
        },
        userAttributes: {
          address: {
            addressOne: '105 2ND AV',
            addressTwo: null,
            city: 'NEWTON',
            state: 'IA',
            zip: '50208',
          },
          dob: {
            day: '1',
            month: 'Feb',
            year: '1971',
          },
          name: {
            first: 'DANIEL',
            last: 'ILES',
            middle: 'J',
          },
          phone: {
            primary: '4045049006',
          },
          ssn: {
            full: '666130041',
            lastfour: '6661',
          },
        },
      },
    },
  },
};
