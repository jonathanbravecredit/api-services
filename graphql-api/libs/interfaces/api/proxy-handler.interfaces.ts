import { IErrorResponse, INil } from 'libs/interfaces';

export interface IProxyHandlerResponse<R> {
  success: boolean;
  error?: IErrorResponse | INil | string;
  data?: R;
}
