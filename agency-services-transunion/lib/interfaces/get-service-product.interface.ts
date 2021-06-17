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
// TODO updated the response with the actual
export interface IGetServiceProductResponse {
  GetServiceProductResult: any;
}
