import { SNSEvent, SNSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import * as soap from 'soap';

let url = 'http://www.thomas-bayer.com/axis2/services/BLZService?wsdl';

/**
 * !!!! FOR TESTING ONLY !!!!
 */
export const main: SNSHandler = async (event: SNSEvent): Promise<any> => {
  try {
    let client = await soap.createClientAsync(url);
    // const res = await wait(client.)
    console.log(client.describe());
    const res = await wait(client);
    console.log('res', res);
    for (const record of event.Records) {
      // do something
    }
    return response(200, { response: 'sucessfully processed all messages' });
  } catch (err) {
    return response(500, { error: err });
  }
};

const wait = (client: soap.Client) => {
  return new Promise((resolve, reject) => {
    client.getBankAsync({}).then((result) => {
      resolve(result);
    });
  });
};
