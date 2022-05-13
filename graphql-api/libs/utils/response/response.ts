/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { APIGatewayProxyResult } from 'aws-lambda';

export const response = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(body, null, 2),
});


export const error = (error: any): APIGatewayProxyResult => ({
  statusCode: error.statusCode,
  headers: {
    "Content-Type": "text/plain",
    "x-amzn-ErrorType": error.code
  },
  "isBase64Encoded": false,
  body: error.code + ": " + error.message
})
export const success = (body: any): APIGatewayProxyResult => response(200, body);
export const failure = (error: any): APIGatewayProxyResult => error(error);
