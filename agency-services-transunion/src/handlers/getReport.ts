import { SNSEvent, SNSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import * as soap from 'soap';

let url = 'http://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL';
let client;

/**
 * !!!! FOR TESTING ONLY !!!!
 */
export const main: SNSHandler = async (event: SNSEvent): Promise<any> => {
  try {
    client = await soap.createClientAsync(url);
    // const res = await wait(client.)
    console.log(client.describe());
    const res = await wait();
    console.log('res', res);
    for (const record of event.Records) {
      // do something
    }
    return response(200, { response: 'sucessfully processed all messages' });
  } catch (err) {
    console.log('My Error:', err);
    return response(500, { error: err });
  }
};

const wait = () => {
  return new Promise((resolve, reject) => {
    client
      .getBankAsync({ ubiNum: 12345 })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
