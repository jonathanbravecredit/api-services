import * as AWS from 'aws-sdk';

const secretsManager = new AWS.SecretsManager({
  region: process.env.AWS_REGION,
});

export const getSecretKey = async (secretId: string) => {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretId }).promise();
    if ('SecretString' in data) {
      return data.SecretString;
    } else {
      let buff = Buffer.from(data.SecretBinary.toString(), 'base64');
      return buff.toString('ascii');
    }
  } catch (err) {
    throw err;
  }
};
