import { IStandardResponse } from 'lib/interfaces';

export interface IGetTrendingDataRequest {
  id: string;
  params: {
    fromDate: string;
    toDate?: string;
  };
}

export interface IGetTrendingDataGraphQLResponse {
  data: {
    getAppData: {
      id?: string;
      agencies?: {
        transunion?: {
          enrollmentKey: string;
          disputeEnrollmentKey: string;
          serviceBundleFulfillmentKey?: string;
          disputeServiceBundleFulfillmentKey?: string;
        };
      };
      user?: {
        userAttributes?: {
          name?: {
            first?: string;
            middle?: string;
            last?: string;
          };
          address?: {
            addressOne?: string;
            addressTwo?: string;
            city?: string;
            state?: string;
            zip?: string;
          };
          phone?: {
            primary?: string;
          };
          dob?: {
            year?: string;
            month?: string;
            day?: string;
          };
          ssn?: {
            lastfour?: string;
            full?: string;
          };
        };
      };
    };
  };
}

export interface IGetTrendingDataPayload {
  RequestKey: string;
  AdditionalInputs?: {
    Data: {
      Name: string;
      Value: string;
    };
  };
  ClientKey: string;
  AtttributeStatus?: string;
  CSRFToken?: string; // product display only
  ClientBrowserType?: string; // product display only
  FromDate?: string;
  GetPartnerTrendingData?: string;
  GetProductTrendingData?: string;
  IpAddress?: string; // product display only
  PartnerTrendingAttributes?: string[];
  ProductDisplay?: string;
  ProductTrendingAttributes?: string[];
  ToDate?: string;
}

export interface IGetTrendingDataPayloadParams {
  fromDate: string;
  toDate: string;
}

export interface IGetTrendingData {
  request: IGetTrendingDataMsg;
}

export interface IGetTrendingDataMsg extends IGetTrendingDataPayload {
  AccountCode: string;
  AccountName: string;
  EnrollmentKey: string;
  Language?: string;
}

export interface IGetTrendingDataResponse {
  Envelope: {
    Body: {
      GetTrendingDataResponse: {
        GetTrendingDataResult: IGetTrendingDataResult;
      };
    };
  };
}

export interface IGetTrendingDataResult extends IStandardResponse {
  PartnerAttributes: any;
  ProductAttributes: IProductAttributes;
}

export interface IProductAttributes {
  ProductTrendingAttributes: IProductTrendingAttributes;
}

export interface IProductTrendingAttributes {
  AttributeName: string;
  Bureau: string;
  ProductAttributeData: IProductAttributeData;
  ServiceBundleCode: string;
  ServiceProduct: string;
}

export interface IProductAttributeData {
  ProductTrendingData: IProductTrendingData[];
}

export interface IProductTrendingData {
  AttributeDate: string;
  AttributeStatus: string;
  AttributeValue: string;
  ServiceProductFulfillmentKey: string;
}
