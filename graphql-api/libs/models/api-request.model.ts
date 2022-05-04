import { IProxyHandlerResponse } from 'libs/interfaces/api/proxy-handler.interfaces';
import { Payloader } from 'libs/utils/payloader/Payloader';

export interface APIRequest {
  reqXML: string;
  resXML: string;
  gqldata: any;
  prepped: any;
  action: string;
  parserOptions: any;
  response: any;
  responseType: string;
  responseError: any;
  results: IProxyHandlerResponse<any>;
  serviceBundleCode: string;
  run: Function;
  runPayloader: Function;
  runRequester: Function;
  runSendAndSync: Function;
  prepPayload: Function;
  setResponses: Function;
  setSuccessResults: Function;
  setFailedResults: Function;
  log: Function;
  logResults: Function;
  payloader: Payloader<any>;
  schema: string;
}
