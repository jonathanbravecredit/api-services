import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { IInitiativePutRequest } from 'libs/interfaces/initiatives/initiative-batch.interfaces';
import { PubSubUtil } from 'libs/utils/pubsub/pubsub';
import { response } from 'libs/utils/response/response';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = event?.requestContext?.authorizer?.claims?.sub;
  if (!userId) return response(200, 'no id found');
  const { parentId, taskId, taskStatus } = JSON.parse(event.body) as IInitiativePutRequest;
  if (!parentId || !taskId || !taskStatus)
    return response(200, `no parentId: ${parentId}; or taskId:${taskId}; or taskStatus: ${taskStatus} provided`);
  if (!process.env.INITIATIVE_TOPIC_ARN)
    return response(200, `no topic available: ${process.env.INITIATIVE_TOPIC_ARN}`);
  const payload = { parentId, taskId, taskStatus };
  const pub = new PubSubUtil();
  pub.createSNSPayload<IInitiativePutRequest>(
    'webAPI',
    'PUT',
    payload,
    'initiativeprogram',
    process.env.INITIATIVE_TOPIC_ARN,
  );
  pub.publishSNSPayload();
  return response(200, 'update initiative sent');
};
