import { SNSEvent, SNSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import * as fs from 'fs';
import { soap } from 'strong-soap';
import * as util from 'util';
import { getSecretKey } from 'lib/utils/secrets';
import { formatIndicativeEnrichment } from 'lib/utils/helpers';
import * as Request from 'request';

// request.debug = true; import * as request from 'request';
const transunionSKLoc = process.env.TU_SECRET_LOCATION;
let key: Buffer;
let cert: Buffer;
let cacert: Buffer;
let username = 'CC2BraveCredit';
let accountCode = '123456789';
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
    const createClientAsync = util.promisify(soap.createClient);
    client = await createClientAsync(url, {
      request: Request.defaults({
        headers: {
          Authorization: auth,
        },
      }),
      // envelopeKey: 'soapenv',
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

    // trying to set the headers correctly
    client.setSecurity(
      new soap.ClientSSLSecurity(key, cert, null, {
        user: user,
        passphrase: passphrase,
      }),
    );

    console.log('client', client);
    console.log('client describe', client.describe());
    for (const record of event.Records) {
      let msg;
      // do something
      switch (JSON.parse(record.Sns.Message)?.action) {
        case 'IndicativeEnrichment':
          msg = formatIndicativeEnrichment(accountCode, username, record.Sns.Message);
          if (msg) {
            const indicativeEnrichmentAsync = util.promisify(client.IndicativeEnrichment);
            const res = await indicativeEnrichmentAsync(msg);
            console.log('res', res);
          }
          break;
        case 'Ping':
          const pingAsync = util.promisify(client.Ping);
          const res = await pingAsync();
          console.log('ping res', res);
          break;
        default:
          break;
      }
    }
    // return response(200, { response: 'sucessfully processed all messages' });
  } catch (err) {
    console.log('error ===>', err);
    console.log('last request ===>', client.lastRequest);
    return;
  }
};

const xml = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:con="https://consumerconnectws.tui.transunion.com/">
  <soapenv:Header/>
  <soapenv:Body>
	<con:Ping/>
  </soapenv:Body>
</soapenv:Envelope>
`;
