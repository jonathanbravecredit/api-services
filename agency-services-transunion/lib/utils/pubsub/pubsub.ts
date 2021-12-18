export class PubSubUtil {
  constructor() {}

  createSNSPayload<T>(subject: string, message: T, service: string = 'transunion:batch'): AWS.SNS.PublishInput {
    return {
      Subject: subject,
      Message: JSON.stringify({
        service: service,
        command: 'POST',
        message: message,
      }),
      TopicArn: process.env.TU_SNS_PROXY_ARN || '',
    };
  }
}
