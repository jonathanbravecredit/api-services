import { SQSEvent, SQSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import axios from 'axios';
import * as https from 'https';
import * as fs from 'fs';

let caCert: Buffer;

export const main: SQSHandler = async (event: SQSEvent): Promise<any> => {
  console.log('I received message --->', event);
  const dte = new Date();
  console.log(`I was called at: ${dte.toLocaleString()}`);
  // return response(200, 'Speaking to you from the VPC');

  try {
    caCert = fs.readFileSync('lib/data/brave.credit.crt');
  } catch (err) {
    console.log('Make sure that the CA cert file is named brave.credit.crt', err);
    return response(500, { error: `Error gathering reading cert=${err}` });
  }

  const httpsAgent = new https.Agent({ ca: caCert, keepAlive: false });

  try {
    for (const record of event.Records) {
      console.log('record=', record);
      // const messageAttributes: SQSMessageAttributes = record.messageAttributes;
      // console.log('Message Attributtes -->  ', messageAttributes.AttributeNameHere.stringValue);
      // console.log('Message Body -->  ', record.body);
      // // Do something
      let res = await axios.get('https://cc2ws-live.sd.demo.truelink.com/wcf/CC2.svc?singleWsdl', {
        httpsAgent: httpsAgent,
      });
      console.log('my response from the external api', res);
    }
    return response(200, { response: 'sucessfully processed all messages' });
  } catch (err) {
    return response(500, { error: err });
  }
};
