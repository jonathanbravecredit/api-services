import { SNSEvent, SNSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import * as fs from 'fs';
// import { soap } from 'strong-soap';
import * as util from 'util';
import { getSecretKey } from 'lib/utils/secrets';
import { formatIndicativeEnrichment } from 'lib/utils/helpers';
import * as request from 'request';
import * as https from 'https';
import axios, { AxiosRequestConfig } from 'axios';

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
// let client: soap.Client;

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
    const httpsAgent = new https.Agent({
      key,
      cert,
      passphrase,
    });
    let options = {
      url: 'https://cc2ws-live.sd.demo.truelink.com/wcf/CC2.svc',
      method: 'POST',
      body: xml,
      headers: {
        'Accept-Encoding': 'gzip,deflate',
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction: 'https://consumerconnectws.tui.transunion.com/ICC2/Ping',
        Authorization: auth,
        'Content-length': xml.length,
        Host: 'cc2ws-live.sd.demo.truelink.com',
        Connection: 'Keep-Alive',
        'User-Agent': 'Apache-HttpClient/4.5.2 (Java/1.8.0_181)',
      },
      key,
      cert,
      passphrase,
    };

    // POST https://cc2ws-live.sd.demo.truelink.com/wcf/CC2.svc HTTP/1.1
    // Accept-Encoding: gzip,deflate
    // Content-Type: text/xml;charset=UTF-8
    // SOAPAction: "https://consumerconnectws.tui.transunion.com/ICC2/IndicativeEnrichment"
    // Authorization: Basic Y2M*************3JA==
    // Content-Length: 2166
    // Host: cc2ws-live.sd.demo.truelink.com
    // Connection: Keep-Alive
    // User-Agent: Apache-HttpClient/4.5.2 (Java/1.8.0_181)

    // const createClientAsync = util.promisify(soap.createClient);
    // client = await createClientAsync(url, {
    //   request: request.defaults({
    //     headers: {
    //       Authorization: auth,
    //     },
    //   }),
    //   // envelopeKey: 'soapenv',
    //   wsdl_options: {
    //     key,
    //     cert,
    //     user,
    //     passphrase,
    //   },
    //   wsdl_headers: {
    //     Authorization: auth,
    //   },
    // });

    // client['wsdl'].definitions.xmlns.con = 'https://consumerconnectws.tui.transunion.com/';
    // client['wsdl'].definitions.xmlns.data = 'https://consumerconnectws.tui.transunion.com/data';
    // client['wsdl'].xmlnsInEnvelope = client['wsdl']._xmlnsMap();

    // trying to set the headers correctly
    // client.setSecurity(
    //   new soap.ClientSSLSecurity(key, cert, null, {
    //     user: user,
    //     passphrase: passphrase,
    //   }),
    // );

    // console.log('client', client);
    // console.log('client describe', client.describe());
    for (const record of event.Records) {
      let msg;
      // do something
      switch (JSON.parse(record.Sns.Message)?.action) {
        case 'IndicativeEnrichment':
          msg = formatIndicativeEnrichment(accountCode, username, record.Sns.Message);
          if (msg) {
            // const indicativeEnrichmentAsync = util.promisify(client.IndicativeEnrichment);
            // // const res2 = await indicativeEnrichmentAsync({ _xml: test });
            // // console.log('res 2', res2);
            // const res = await indicativeEnrichmentAsync(msg);
            // console.log('res', res);
          }
          break;
        case 'Ping':
          const pingAsync = util.promisify(request);
          // const res2 = await indicativeEnrichmentAsync({ _xml: test });
          // console.log('res 2', res2);
          const res = await pingAsync(options);
          console.log('ping res', res);

          // const axiosConfig: AxiosRequestConfig = {
          //   ...options,
          // };
          // const axiosRes = await axios(axiosConfig);

          break;
        default:
          break;
      }
    }
    // return response(200, { response: 'sucessfully processed all messages' });
  } catch (err) {
    console.log('error ===>', err);
    // console.log('last request ===>', client.lastRequest);
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
