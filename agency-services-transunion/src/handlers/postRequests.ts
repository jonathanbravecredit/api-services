import { SNSEvent, SNSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import * as fs from 'fs';
import * as soap from 'soap';
import { getSecretKey } from 'lib/utils/secrets';

// request.debug = true; import * as request from 'request';
const transunionSKLoc = process.env.TU_SECRET_LOCATION;
let key: Buffer;
let cert: Buffer;
let cacert: Buffer;
let username = 'CC2BraveCredit';
let url = 'https://cc2ws-live.sd.demo.truelink.com/wcf/CC2.svc?singleWsdl';
let user;
let auth;
let passphrase;
let password;

/**
 * Handler that processes single requests for Transunion services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @param message.name Name of client
 * @param messsage.ssnLastFour Last four of SSN of client
 * @returns Lambda proxy response
 */
export const main: SNSHandler = async (event: SNSEvent): Promise<any> => {
  try {
    const secretJSON = await getSecretKey(transunionSKLoc);
    const { tuKeyPassphrase, tuPassword } = JSON.parse(secretJSON);
    password = tuPassword;
    passphrase = tuKeyPassphrase;
    user = `${username}:${password}`;
    auth = 'Basic ' + Buffer.from(user).toString('base64');
  } catch (err) {
    return response(500, { error: `Error gathering/reading secrets=${err}` });
  }

  try {
    key = fs.readFileSync('/opt/tubravecredit.key');
    cert = fs.readFileSync('/opt/brave.credit.crt');
    cacert = fs.readFileSync('/opt/Root-CA-Bundle.crt');
  } catch (err) {
    return response(500, { error: `Error gathering/reading cert=${err}` });
  }
  try {
    let client = await soap.createClientAsync(url, {
      wsdl_options: {
        key,
        cert,
        user,
        passphrase,
      },
      wsdl_headers: {
        Authorization: auth,
      },
    });
    console.log('client', client);
    for (const record of event.Records) {
      // do something
    }
    return response(200, { response: 'sucessfully processed all messages' });
  } catch (err) {
    return response(500, { error: err });
  }
};
