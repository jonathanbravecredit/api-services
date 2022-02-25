import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { IInitiativePostRequest } from 'libs/interfaces/initiatives/initiative-batch.interfaces';
import { PubSubUtil } from 'libs/utils/pubsub/pubsub';
import { response } from 'libs/utils/response/response';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = event?.requestContext?.authorizer?.claims?.sub;
  if (!userId) return response(200, 'no id found');
  const { reason, programId } = JSON.parse(event.body) as IInitiativePostRequest;
  if (!reason || !programId) return response(200, `no reason: ${reason}; or programId:${programId} provided`);
  if (!process.env.INITIATIVE_TOPIC_ARN)
    return response(200, `no topic available: ${process.env.INITIATIVE_TOPIC_ARN}`);
  const payload = { userId, reason, programId };
  const pub = new PubSubUtil();
  pub.createSNSPayload<IInitiativePostRequest>(
    'webAPI',
    'POST',
    payload,
    'initiativeprogram',
    process.env.INITIATIVE_TOPIC_ARN,
  );
  pub.publishSNSPayload();
  return response(200, 'create initiative sent');
};
