import { TU_ERROR_CODES } from 'libs/data/constants';
import { IErrorCode, IErrorResult } from 'libs/interfaces';

export const errorHandler = (method: string, results: IErrorResult): IErrorCode | null => {
  if (!Object.keys(results.ErrorResponse).length) return null;
  const resp = results.ErrorResponse;
  const { Code, Message, Name } = resp;
  if (!Code) return null;
  const error: IErrorCode = TU_ERROR_CODES[`${Code}`];
  return error;
};
