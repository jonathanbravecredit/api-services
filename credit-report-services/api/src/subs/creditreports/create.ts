import { SQSEvent, SQSHandler } from 'aws-lambda';

export const main: SQSHandler = async (event: SQSEvent): Promise<any> => {
  event.Records.map((r) => {
    console.log('test event: ', r);
  });
};
