import { SQSEvent, SQSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import { getSecretKey } from 'lib/utils/secrets';

// request.debug = true;
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
 * Handler that process batch requests for Transunion Services
 * @param service Service invoked via the SNS Proxy 'transunion'
 * @param command REST based command to invoke actions
 * @param message Object containing service specific package for processing
 * @param message.name Name of client
 * @param messsage.ssnLastFour Last four of SSN of client
 * @returns Lambda proxy response
 */
export const main: SQSHandler = async (event: SQSEvent): Promise<any> => {
  // batch up items through the day/evening to process lots of data

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
};
