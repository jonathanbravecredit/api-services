import { SNSEvent, SNSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import * as fs from 'fs';
import * as soap from 'soap';
import * as util from 'util';
import { getSecretKey } from 'lib/utils/secrets';
import { formatIndicativeEnrichment } from 'lib/utils/helpers';

// request.debug = true; import * as request from 'request';
const transunionSKLoc = process.env.TU_SECRET_LOCATION;
let key: Buffer;
let cert: Buffer;
let cacert: Buffer;
let username = 'CC2BraveCredit';
let accountCode = 'Q0NJdGtkQThtR3hwaQ';
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
    console.log('client', client.describe());
    for (const record of event.Records) {
      // do something
      switch (JSON.parse(record.Sns.Message)?.action) {
        case 'IndicativeEnrichment':
          const msg = formatIndicativeEnrichment(accountCode, username, record.Sns.Message);
          console.log('formatted msg', JSON.stringify(msg));
          if (msg) {
            const promise = new Promise(function (resolve, reject) {
              setTimeout(() => resolve(client.CC2.Soap12.IndicativeEnrichment(msg)), 0);
            });
            console.log('promise', promise);
            const res = await promise;
            console.log('res', res);
            return promise;
            // const cc2 = new Promise((resolve, reject) => {
            //   resolve(client.CC2.Soap12.IndicativeEnrichment(msg));
            // });

            // const indicativeEnrichmentAsync = util.promisify(client.CC2.Soap12.IndicativeEnrichment);
            // console.log('promisified function', indicativeEnrichmentAsync);
            // const res = await indicativeEnrichmentAsync(msg);
            // console.log('response', res);
          }
          break;

        default:
          break;
      }
    }
    // return response(200, { response: 'sucessfully processed all messages' });
  } catch (err) {
    console.log('error ===>', err);
    return;
  }
};
