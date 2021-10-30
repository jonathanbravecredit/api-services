import Logger from 'lib/utils/db/logs/logger';
import { APIErrorLog } from 'lib/utils/db/logs/model/api-error.model';
import { createErrorLog, getErrorLog, listErrorLog } from 'lib/utils/db/logs/queries/api-error.queries';
import * as uuid from 'uuid';

export default class ErrorLog {
  constructor() {}
  logger = new Logger<APIErrorLog>(getErrorLog, listErrorLog, createErrorLog);

  createError(userId, action, error): APIErrorLog {
    const errorId = uuid.v4();
    const createdOn = new Date().toISOString();
    return {
      userId,
      errorId,
      action,
      error,
      createdOn,
    };
  }
}
