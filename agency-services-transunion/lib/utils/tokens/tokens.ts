import axios, { AxiosResponse } from 'axios';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import { IJwks } from 'lib/interfaces';

export const validateToken = async (token: string | undefined): Promise<string | undefined> => {
  let user: string;
  let pem: string;
  try {
    if (token) {
      const decodedToken = jwt.decode(token, { complete: true });
      console.log('decoded token ===> ', decodedToken);
      const { data } = await axios({
        method: 'GET',
        url: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.POOL_ID}/.well-known/jwks.json`,
      });
      const jwks: IJwks = JSON.parse(data);
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
