import axios from 'axios';
import { IAccessToken, IJwks } from 'libs/interfaces';
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
    return user;
  } catch (err) {
    throw new Error(err);
  }
};
