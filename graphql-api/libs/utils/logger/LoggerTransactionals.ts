import * as uuid from 'uuid';
import { APITransactionLog } from 'libs/utils/db/logger/model/api-transaction.model';
import { createTransactionLog } from 'libs/utils/db/logger/queries/api-transaction.queries';
import { LoggerErrors } from 'libs/utils/logger/LoggerErrors';

interface TUResponseLogData {
  response: any;
  responseError: any;
  responseType: any;
}

export class LoggerTransactionals extends LoggerErrors {
  constructor(protected action: string) {
    super(action);
  }

  createTransaction(userId, action, transaction): APITransactionLog {
    const transactionId = uuid.v4();
    const createdOn = new Date().toISOString();
    return {
      userId,
      transactionId,
      action,
      transaction,
      createdOn,
    };
  }

  async log(clientKey: string, data: any, type: 'TRANSUNION' | 'GENERIC' | 'ERROR'): Promise<void> {
    if (type === 'TRANSUNION') {
      await this.logTransunionResponseTransaction(clientKey, data);
    } else if (type === 'GENERIC') {
      await this.logGenericTransaction(clientKey, JSON.stringify(data));
    } else if (type === 'ERROR') {
      await this.logGenericError(clientKey, data);
    }
  }

  async logTransunionResponseTransaction(id: string, data: TUResponseLogData): Promise<void> {
    // log tu responses
    const l1 = this.createTransaction(id, `${this.action}:data`, JSON.stringify(data.response));
    const l2 = this.createTransaction(id, `${this.action}:type`, JSON.stringify(data.responseType));
    const l3 = this.createTransaction(id, `${this.action}:error`, JSON.stringify(data.responseError));
    await this.writeTransaction(l1);
    await this.writeTransaction(l2);
    await this.writeTransaction(l3);
  }

  async logGenericTransaction(id: string, data: any): Promise<void> {
    const l1 = this.createTransaction(id, `${this.action}:data`, JSON.stringify(data));
    await this.writeTransaction(l1);
  }

  async writeTransaction(err: APITransactionLog): Promise<void> {
    await createTransactionLog(err);
  }
}
