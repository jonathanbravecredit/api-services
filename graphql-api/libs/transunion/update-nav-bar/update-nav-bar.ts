import * as https from 'https';
import * as interfaces from 'libs/interfaces';
import { ajv } from 'libs/schema/validation';
import { INavBarRequest } from 'libs/transunion/update-nav-bar/nav-bar-request.interface';
import { updateNavBarBadges } from 'libs/utils/db/dynamo-db/dynamo';
import ErrorLogger from 'libs/utils/db/logger/logger-errors';

const errorLogger = new ErrorLogger();

/**
 * Simple method to ping TU services and ensure a successful response
 * @param {https.Agent} agent
 * @param {string} auth
 * @returns
 */
export const UpdateNavBar = async ({
  accountCode,
  username,
  message,
  agent,
  auth,
  identityId,
}: {
  accountCode: string;
  username: string;
  message: string;
  agent: https.Agent;
  auth: string;
  identityId: string;
}): Promise<{
  success: boolean;
  error?: interfaces.IErrorResponse | interfaces.INil | string;
  data?: any;
}> => {
  const payload: INavBarRequest = {
    id: identityId,
    ...JSON.parse(message),
  };
  const validate = ajv.getSchema<INavBarRequest>('navBarRequest');
  if (!validate(payload)) throw `Malformed message=${JSON.stringify(payload)}`;

  try {
    await updateNavBarBadges(payload);
    return { success: true, error: null, data: null };
  } catch (err) {
    const error = errorLogger.createError(identityId, 'UpdateNavBar', JSON.stringify(err));
    await errorLogger.logger.create(error);
    return { success: false, error: err };
  }
};
