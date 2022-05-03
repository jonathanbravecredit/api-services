import { IFulfillServiceProductResponse } from 'libs/interfaces';
import { IStandardResponse } from 'libs/interfaces/transunion/common-tu.interface';

export interface IGetServiceProduct {
  request: IGetServiceProductMsg;
}

export interface IGetServiceProductMsg {
  AccountCode: string;
  AccountName: string;
  AdditionalInputs?: {
    Data: {
      Name: string;
      Value: string;
    };
  };
  RequestKey: string;
  ClientKey: string;
  CSRFToken?: string;
  ClientBrowserType?: string;
  IpAddress?: string;
  ProductDisplay: string;
  SeviceBundleFulfillmentKey: string;
}

export interface IGetServiceProductResponse {
  Envelope: {
    Body: {
      GetServiceProductResponse: {
        GetServiceProductResult: IGetServiceProductResult;
      };
    };
  };
}
// TODO updated the response with the actual
export interface IGetServiceProductResult extends IStandardResponse {
  ProductDisplayToken?: any;
  ServiceProductFulfillments: {
    ServiceProductResponse: IFulfillServiceProductResponse[] | IFulfillServiceProductResponse;
  };
}
