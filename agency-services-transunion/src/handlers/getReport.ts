import { SNSEvent, SNSHandler } from 'aws-lambda';
import { response } from 'lib/utils/response';
import * as fs from 'fs';
import * as soap from 'soap';
import { getSecretKey } from 'lib/utils/secrets';

let url = 'https://www.webservicex.com/globalweather.asmx?wsdl';

/**
 * !!!! FOR TESTING ONLY !!!!
 */
export const main: SNSHandler = async (event: SNSEvent): Promise<any> => {
  try {
    let client = await soap.createClientAsync(url);
    console.log(client.describe());
    for (const record of event.Records) {
      // do something
    }
    return response(200, { response: 'sucessfully processed all messages' });
  } catch (err) {
    return response(500, { error: err });
  }
};
