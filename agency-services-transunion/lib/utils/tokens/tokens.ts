import axios, { AxiosResponse } from 'axios';
import { IAccessToken, IJwks } from 'lib/interfaces';
import * as AWS from 'aws-sdk';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';

export const validateToken = async (token: string | undefined): Promise<IAccessToken | undefined> => {
  let user: IAccessToken;
  let pem: string;
  try {
    if (token) {
      const decodedToken = jwt.decode(token, { complete: true });
      const res = await axios({
        method: 'GET',
        url: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.POOL_ID}/.well-known/jwks.json`,
      });
      const jwks: IJwks = res.data;
      const keyObject = jwks.keys.find((key) => key.kid == decodedToken.header.kid);
      pem = jwkToPem(keyObject); //convert jwk to pem
    }
    jwt.verify(token, pem, (error, decoded) => {
      if (error) {
        console.error(error);
        throw new Error(error);
      }
      user = decoded;
    });
    console.log('decoded user ===> ', user);
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

export const getCognitoIdentityId = async (jwtToken: string): Promise<string | undefined> => {
  console.log('token ===> ', jwtToken);
  AWS.config.region = process.env.AWS_REGION;

  const params = getCognitoIdentityIdParams(jwtToken);
  // const cognitoIdentity = new AWS.CognitoIdentity();
  AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
  const identityId = AWS.config.credentials['identityId'];
  console.log('identityId ===> ', identityId);
  console.log('params ===> ', params);
  try {
    // const data = await cognitoIdentity.getId(params).promise();
    // console.log('data new appraoch ==> ', data);
    const data2 = identityId;
    console.log('data 2 ===>', data2);
    if (data2) return data2;
    // if (data.IdentityId) return data.IdentityId;
    // console.log('data identity id new appraoch ==> ', data.IdentityId);
    throw new Error('Invalid authorization token.');
  } catch (err) {
    console.log('token error ===> ', err);
    throw err;
  }
};

export const getCognitoIdentityIdParams = (jwtToken: string) => {
  const { POOL_ID, ACCOUNT_ID, IDENTITY_ID, AWS_REGION } = process.env;
  const loginsKey = `cognito-idp.${AWS_REGION}.amazonaws.com/${POOL_ID}`;
  console.log('logins key ===> ', loginsKey);
  return {
    IdentityPoolId: IDENTITY_ID,
    AccountId: ACCOUNT_ID,
    Logins: {
      [loginsKey]: jwtToken,
    },
  };
};
