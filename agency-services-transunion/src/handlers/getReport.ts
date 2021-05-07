import { Handler, SNSEvent } from 'aws-lambda';
import { response } from 'lib/utils/response';
import axios from 'axios';

export const main: Handler = async (event: SNSEvent): Promise<any> => {
  console.log('I received message --->', event);
  const dte = new Date();
  console.log(`I was called at: ${dte.toLocaleString()}`);
  // return response(200, 'Speaking to you from the VPC');

  try {
    const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    console.log('my response from the external api', res);
    return response(200, { response: res });
  } catch (err) {
    return response(500, { error: err });
  }
};
