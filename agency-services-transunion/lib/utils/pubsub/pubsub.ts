export class PubSubUtil {
  constructor() {}

  createSNSPayload<T>(
    subject: string,
    message: T,
    service: string,
    topic: string = process.env.TU_SNS_PROXY_ARN,
  ): AWS.SNS.PublishInput {
    return {
      Subject: subject,
      Message: JSON.stringify({
        service: service,
        command: 'POST',
        message: message,
      }),
      MessageAttributes: {
        service: {
          DataType: 'String',
          StringValue: service,
        },
      },
      TopicArn: topic || '',
    };
  }
}
