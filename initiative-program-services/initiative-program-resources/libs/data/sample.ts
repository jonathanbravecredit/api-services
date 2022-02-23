export const MOCKPROGRESSTRACKERDATA = {
  id: 'future_score',
  initiative: 'future_score',
  initiativeReason: 'credit_card',
  initiativeStatus: 'in_progress',
  initiativeTitle: 'Your plan to get a credit card:',
  primaryTasks: [
    {
      parentId: 'future_score',
      taskId: 'credit_card',
      taskStatus: 'in_progress',
      taskOrder: 0,
      taskLabel: 'Obtained Credit Card',
      taskCard: {
        header: "Let's help you get a credit card!",
        textOne:
          "We've made it easy for you to reach your goal and claim your FutureScore. Follow these steps, and with healthy financial habits, you could get your credit card in not time!",
      },
      subTasks: [
        {
          parentId: 'credit_card',
          taskId: 'review_report',
          taskStatus: 'complete',
          taskOrder: 0,
          subTasks: null,
          taskLabel: 'Review your report',
          taskCard: {
            header: 'Review your credit report',
            textOne:
              "You could gain an average of 19 points on your score if there's an error on your report, or even up to 130*.",
            textTwo:
              "Look for accounts or personal information you don't recognize. Find an issue? Dispute it in our app to request it be removed which could help your score.",
            textButton: 'Review my report',
            metric: '+19',
            successHeader: 'Greate job reviewing your credit report',
            successText: 'Checking it on a monthly basis ensures the information on your reports remains yours',
            questionHeader: 'Do you have at least $9,450 saved?',
            link: '',
          },
        },
        {
          parentId: 'credit_card',
          taskId: 'claim_future_score',
          taskStatus: 'not_started',
          taskOrder: 1,
          subTasks: null,
          taskLabel: 'Claim your FutureScore',
          taskCard: {
            header: 'Claim Your FutureScore to get your dream credit card',
            textOne:
              'Opening this account can help you grow score 53 points or more! It can also automatically unlock a secured credit card, to reach an unsecured card quicker.',
            textTwo: 'With on-time payments, you can grow your score and also build up a nice savings account!',
            textButton: 'Open my account',
            metric: '+53',
            successHeader: 'Good work opening the account!',
            successText: 'Make on-time payments on this and your other accounts to get the full benefit',
            questionHeader: 'Do you have at least $9,450 saved?',
            link: '',
          },
        },
      ],
    },
  ],
};
