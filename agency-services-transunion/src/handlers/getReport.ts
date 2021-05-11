import { SQSEvent, SQSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import * as fs from 'fs';
import * as request from 'request';
import * as soap from 'soap';
import { ISecurity } from 'soap';

request.debug = true;

let key: Buffer;
let cert: Buffer;
let cacert: Buffer;
let username = 'CC2BraveCredit';
let password = 'CCItkdA8mGxpi';
let user = `${username}:${password}`;
let passphrase = 'Alpjlp17103624';
let url = 'https://cc2ws-live.sd.demo.truelink.com/wcf/CC2.svc?singleWsdl';
let auth = 'Basic ' + Buffer.from(user).toString('base64');

export const main: SQSHandler = async (event: SQSEvent): Promise<any> => {
  // CONFIRMED WORKING WITH THIS SERVER
  // url = 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso?wsdl';
  // let client = yield soap["createClientAsync"](url);
  // console.log(client)

  //   return response(200, {
  //     response: 'sucessfully processed all messages'
  //   });

  try {
    // CONFIRMED IMPORTED CORRECTLY
    key = fs.readFileSync('/opt/tubravecredit.key');
    cert = fs.readFileSync('/opt/brave.credit.crt');
    cacert = fs.readFileSync('/opt/Root-CA-Bundle.crt');
  } catch (err) {
    return response(500, { error: `Error gathering reading cert=${err}` });
  }

  try {
    let client = await soap.createClientAsync(url, {
      wsdl_options: {
        key,
        cert,
        user,
        passphrase,
        timeout: 5000,
      },
      wsdl_headers: {
        Authorization: auth,
      },
    });
    console.log('last request', client.lastRequest);
    console.log('client ====> ', client);

    for (const record of event.Records) {
      // do something
    }
    return response(200, { response: 'sucessfully processed all messages' });
  } catch (err) {
    console.log('err ===> ', err);
    return response(500, { error: err });
  }
};
