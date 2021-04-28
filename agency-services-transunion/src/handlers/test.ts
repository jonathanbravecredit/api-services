import { Context, APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { response } from 'lib/utils/response';

export const main: Handler = async (event: Event): Promise<APIGatewayProxyResult> => {
  return response(200, 'Speaking to you from the VPC');
};
