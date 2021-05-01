import { Handler, SNSEvent } from 'aws-lambda';
import { response } from 'lib/utils/response';

export const main: Handler = async (event: SNSEvent): Promise<any> => {
  console.log('I received message --->', event);
  const dte = new Date();
  console.log(`I was called at: ${dte.toLocaleString()}`);
  // return response(200, 'Speaking to you from the VPC');
};
