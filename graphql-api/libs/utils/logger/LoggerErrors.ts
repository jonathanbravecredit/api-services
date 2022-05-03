import * as uuid from 'uuid';
import { APIErrorLog } from 'libs/utils/db/logger/model/api-error.model';
import { createErrorLog } from 'libs/utils/db/logger/queries/api-error.queries';

export class LoggerErrors {
  constructor(private errorAction: string) {}

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

  async logGenericError(id: string, data: any): Promise<void> {
    const l1 = this.createError(id, `${this.errorAction}:data`, JSON.stringify(data));
    await this.writeError(l1);
  }

  async writeError(err: APIErrorLog): Promise<void> {
    await createErrorLog(err);
  }
}
