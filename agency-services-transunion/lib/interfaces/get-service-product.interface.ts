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
  SeviceBundleFulfillmentKey: string;
}
// TODO updated the response with the actual
export interface IGetServiceProductResponse {
  GetServiceProductResult: any;
}
