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
      //https://cognito-idp.us-east-2.amazonaws.com/us-east-2_beTcykTM9/.well-known/jwks.json
      await axios({
        method: 'GET',
        url: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.POOL_ID}/.well-known/jwks.json`,
      }).then((resp) => {
        if (resp['statusCode'] != 200) {
          throw new Error(
            `Request of JWT key with unexpected statusCode: expecting 200, received ${resp['statusCode']}`,
          );
        }
        const { data } = resp; //GET THE REPSONCE BODY
        const jwks: IJwks = JSON.parse(data); //body is a string, convert it to JSON
        console.log('parsed jwks ===> ', jwks);
        // body is an array of more than one JW keys.  User the key id in the JWT header to select the correct key object
        const keyObject = jwks.keys.find((key) => key.kid == decodedToken.header.kid);
        pem = jwkToPem(keyObject); //convert jwk to pem
      });
    }
    //VERIFY THE JWT SIGNATURE. IF THE SIGNATURE IS VALID, THEN ADD THE JWT TO THE IDENTITY OBJECT.
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
