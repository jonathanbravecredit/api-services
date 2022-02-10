import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event: ', JSON.stringify(event));
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  if (!sub) return response(200, null);
  return response(200, null);
};
