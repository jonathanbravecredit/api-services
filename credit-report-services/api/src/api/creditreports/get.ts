import 'reflect-metadata';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';
import { getReport } from 'libs/queries/CreditReport.queries';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ==> ', JSON.stringify(event));
  const sub = event?.requestContext?.authorizer?.claims?.sub;
  if (!sub) return response(200, 'no id provided');
  try {
    const report = await getReport(sub, 0);
    return response(200, report);
  } catch (err) {
    return response(500, err);
  }
};
