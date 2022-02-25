import { SNS } from 'aws-sdk';
const sns = new SNS();

export class PubSubUtil {
  payload: SNS.PublishInput | undefined;
  constructor() {}

  createSNSPayload<T>(subject: string, command: string, message: T, service: string, topic: string): SNS.PublishInput {
    return {
      Subject: subject,
      Message: JSON.stringify({
        service: service,
        command: command,
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

  async publishSNSPayload(): Promise<any> {
    if (!this.payload) throw 'payload must be set to publish';
    await sns
      .publish(this.payload)
      .promise()
      .then((data: any) => {
        console.log('Results from sending message: ', JSON.stringify(data, null, 2));
      })
      .catch((err: any) => {
        console.error('Unable to send message. Error JSON:', JSON.stringify(err, null, 2));
      });
  }
}
