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

    // client['wsdl'].definitions.xmlns.con = 'https://consumerconnectws.tui.transunion.com/';
    // client['wsdl'].definitions.xmlns.data = 'https://consumerconnectws.tui.transunion.com/data';
    // client['wsdl'].xmlnsInEnvelope = client['wsdl']._xmlnsMap();

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
      // do something
      switch (JSON.parse(record.Sns.Message)?.action) {
        case 'IndicativeEnrichment':
          const msg = formatIndicativeEnrichment(accountCode, username, record.Sns.Message);
          if (msg) {
            const indicativeEnrichmentAsync = util.promisify(client.IndicativeEnrichment);
            // const res2 = await indicativeEnrichmentAsync({ _xml: test });
            // console.log('res 2', res2);
            const res = await indicativeEnrichmentAsync(msg);
            console.log('res', res);
          }
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

// const wait = (msg) => {
//   return new Promise((resolve, reject) => {
//     client
//       .IndicativeEnrichmentAsync(msg)
//       .then((result) => {
//         resolve(result);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// };

// const test = `
// <con:IndicativeEnrichment>
//       <con:request>
//         <AccountCode>123456789</AccountCode>
//         <AccountName>CC2BraveCredit</AccountName>
//         <AdditionalInputs>
//           <Data>
//             <Name>CreditReportVersion</Name>
//             <Value>7</Value>
//           </Data>
//         </AdditionalInputs>
//         <RequestKey>076b9ae3-9a5c-45ea-8b76-4377168e1650</RequestKey>
//         <ClientKey>22545f5a-3a68-42f2-8be9-9d639edbb958</ClientKey>
//         <Customer>
//           <CurrentAddress>
//             <AddressLine1>1202 Main St</AddressLine1>
//             <AddressLine2 xsi:nil="true"
//               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></AddressLine2>
//             <City>Fort Wayne</City>
//             <State>IN</State>
//             <Zipcode>46808</Zipcode>
//           </CurrentAddress>
//           <DateOfBirth>2021-06-01</DateOfBirth>
//           <FullName>
//             <FirstName>Charles</FirstName>
//             <LastName>FAULCON</LastName>
//             <MiddleName>L</MiddleName>
//             <Prefix xsi:nil="true"
//               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></Prefix>
//             <Suffix xsi:nil="true"
//               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></Suffix>
//           </FullName>
//           <PreviousAddress>
//             <AddressLine1 xsi:nil="true"
//               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></AddressLine1>
//             <AddressLine2 xsi:nil="true"
//               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></AddressLine2>
//             <City xsi:nil="true"
//               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></City>
//             <State xsi:nil="true"
//               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></State>
//             <Zipcode xsi:nil="true"
//               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></Zipcode>
//           </PreviousAddress>
//           <Ssn>000003657</Ssn>
//         </Customer>
//         <ServiceBundleCode>CC2BraveCreditIndicativeEnrichment</ServiceBundleCode>
//       </con:request>
//     </con:IndicativeEnrichment>
//     `;
