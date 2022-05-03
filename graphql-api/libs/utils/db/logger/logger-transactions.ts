import Logger from 'libs/utils/db/logger/logger';
import { APITransactionLog } from 'libs/utils/db/logger/model/api-transaction.model';
import {
  createTransactionLog,
  getTransactionLog,
  listTransactionLog,
} from 'libs/utils/db/logger/queries/api-transaction.queries';
import * as uuid from 'uuid';

export default class TransactionLogger {
  constructor() {}
  logger = new Logger<APITransactionLog>(getTransactionLog, listTransactionLog, createTransactionLog);
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
}
