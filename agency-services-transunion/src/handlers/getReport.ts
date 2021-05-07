import { SQSEvent, SQSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import axios from 'axios';

export const main: SQSHandler = async (event: SQSEvent): Promise<any> => {
  console.log('I received message --->', event);
  const dte = new Date();
  console.log(`I was called at: ${dte.toLocaleString()}`);
  // return response(200, 'Speaking to you from the VPC');

  try {
    for (const record of event.Records) {
      console.log('record=', record);
      // const messageAttributes: SQSMessageAttributes = record.messageAttributes;
      // console.log('Message Attributtes -->  ', messageAttributes.AttributeNameHere.stringValue);
      // console.log('Message Body -->  ', record.body);
      // // Do something
      let res = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
      console.log('my response from the external api', res);
    }
    return response(200, { response: 'sucessfully processed all messages' });
  } catch (err) {
    return response(500, { error: err });
  }
};
