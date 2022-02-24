import { IErrorResponse, INil } from 'lib/interfaces';

export interface IProxyHandlerResponse<R> {
  success: boolean;
  error?: IErrorResponse | INil | string;
  data?: R;
}
