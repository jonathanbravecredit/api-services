import axios, { AxiosResponse } from 'axios';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import { IJwks } from 'lib/interfaces';
import * as AWS from 'aws-sdk';

export const validateToken = async (token: string | undefined): Promise<string | undefined> => {
  let user: string;
  let pem: string;
  try {
    if (token) {
      const decodedToken = jwt.decode(token, { complete: true });
      console.log('decoded token ===> ', decodedToken);
      const res = await axios({
        method: 'GET',
        url: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.POOL_ID}/.well-known/jwks.json`,
      });
      console.log('response ===> ', res, res.data);
      const jwks: IJwks = res.data;
      console.log('parsed jwks ===> ', jwks);
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
  const params = getCognitoIdentityIdParams(jwtToken);
  const cognitoIdentity = new AWS.CognitoIdentity();
  console.log('params ===> ', params);
  try {
    const data = await cognitoIdentity.getId(params).promise();
    console.log('data new appraoch ==> ', data);
    if (data.IdentityId) return data.IdentityId;
    console.log('data identity id new appraoch ==> ', data.IdentityId);
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
