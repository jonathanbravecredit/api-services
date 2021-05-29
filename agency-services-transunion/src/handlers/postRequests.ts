import { SNSEvent, SNSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import * as fs from 'fs';
import * as soap from 'soap';
import * as util from 'util';
import { getSecretKey } from 'lib/utils/secrets';
import { formatIndicativeEnrichment } from 'lib/utils/helpers';
import { SSL_OP_NO_TLSv1_2 } from 'constants';

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
let client: soap.Client;

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
    client = await soap.createClientAsync(url, {
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
    client.addHttpHeader('Authorization', auth);
    client.setSecurity(
      new soap.ClientSSLSecurity(
        fs.readFileSync('/opt/tubravecredit.key'),
        fs.readFileSync('/opt/brave.credit.crt'),
        null,
        {
          rejectUnauthorized: false,
          strictSSL: false,
          secureOptions: SSL_OP_NO_TLSv1_2,
          user: user,
          passphrase: passphrase,
        },
      ),
    );

    console.log('client', client.describe());
    for (const record of event.Records) {
      // do something
      switch (JSON.parse(record.Sns.Message)?.action) {
        case 'IndicativeEnrichment':
          const msg = formatIndicativeEnrichment(accountCode, username, record.Sns.Message);
          console.log('formatted msg', JSON.stringify(msg));
          if (msg) {
            const res = await wait(msg);
            console.log('res', res);
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

const wait = (msg) => {
  return new Promise((resolve, reject) => {
    client
      .IndicativeEnrichmentAsync(msg)
      .then((result) => {
        console.log('last request', client.lastRequest);
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
