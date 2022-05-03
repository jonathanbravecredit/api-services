import Logger from 'libs/utils/db/logger/logger';
import { APIErrorLog } from 'libs/utils/db/logger/model/api-error.model';
import { createErrorLog, getErrorLog, listErrorLog } from 'libs/utils/db/logger/queries/api-error.queries';
import * as uuid from 'uuid';

export default class ErrorLogger {
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
