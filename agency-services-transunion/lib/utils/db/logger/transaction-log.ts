import Logger from 'lib/utils/db/logs/logger';
import { APITransactionLog } from 'lib/utils/db/logs/model/api-transaction.model';
import {
  createTransactionLog,
  getTransactionLog,
  listTransactionLog,
} from 'lib/utils/db/logs/queries/api-transaction.queries';
import * as uuid from 'uuid';

export default class TransactionLog {
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
