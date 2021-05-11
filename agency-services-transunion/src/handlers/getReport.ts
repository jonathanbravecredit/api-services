import { SQSEvent, SQSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import * as fs from 'fs';
import * as request from 'request';
import * as soap from 'soap';

let key: Buffer;
let cert: Buffer;
let ca: Buffer;
let url = 'https://cc2ws-live.sd.demo.truelink.com/wcf/CC2.svc?singleWsdl';

export const main: SQSHandler = async (event: SQSEvent): Promise<any> => {
  console.log('I received message --->', event);
  const dte = new Date();
  console.log(`I was called at: ${dte.toLocaleString()}`);
  // return response(200, 'Speaking to you from the VPC');

  try {
    key = fs.readFileSync('/opt/tubravecredit.key');
    cert = fs.readFileSync('/opt/brave.credit.crt');
    ca = fs.readFileSync('/opt/Root-CA-Bundle.crt');
  } catch (err) {
    console.log('Make sure that the CA cert file is named brave.credit.crt', err);
    return response(500, { error: `Error gathering reading cert=${err}` });
  }

  // const httpsAgent = new https.Agent({ ca: caCert, keepAlive: false });

  try {
    for (const record of event.Records) {
      console.log('record=', record);
      // const messageAttributes: SQSMessageAttributes = record.messageAttributes;
      // console.log('Message Attributtes -->  ', messageAttributes.AttributeNameHere.stringValue);
      // console.log('Message Body -->  ', record.body);
      // // Do something
      let requestDefaults = request.defaults({ ciphers: 'ALL' });
      let client = await soap.createClientAsync(url, {
        request: requestDefaults,
        wsdl_options: {
          key,
          cert,
          ca,
        },
      });
      console.log('client', client);
      // let security = new soap.ClientSSLSecurity(key, cert, ca);
      // client.setSecurity(security);

      // let res = await axios.get('https://cc2ws-live.sd.demo.truelink.com/wcf/CC2.svc?singleWsdl', {
      //   httpsAgent: httpsAgent,
      // });
      // console.log('my response from the external api', res);
    }
    return response(200, { response: 'sucessfully processed all messages' });
  } catch (err) {
    return response(500, { error: err });
  }
};
