import { IStandardResponse } from 'libs/interfaces/transunion/common-tu.interface';
import { AddressInput, DobInput, NameInput, PhoneInput, SsnInput } from 'src/api/api.service';

export interface IGetAuthenticationQuestionsRequest {
  name: NameInput;
  address: AddressInput;
  dob: DobInput;
  phone: PhoneInput;
  ssn: SsnInput;
  dobformatted?: string;
}

export interface IGetAuthenticationQuestionsPayload extends IGetAuthenticationQuestionsRequest {
  id: string;
  serviceBundleCode: string;
}
export interface IGetAuthenticationQuestions {
  request: {
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
    Customer: {
      CurrentAddress: {
        AddressLine1: string;
        AddressLine2?: string;
        City: string;
        State: string;
        Zipcode: string;
      };
      PreviousAddress: {
        AddressLine1?: string;
        AddressLine2?: string;
        City?: string;
        State?: string;
        Zipcode?: string;
      };
      DateOfBirth: string;
      FullName: {
        FirstName: string;
        LastName: string;
        MiddleName?: string;
        Prefix?: string;
        Suffix?: string;
      };
      PhoneNumber?: string;
      Ssn: string;
    };
    Email?: string;
    Language?: string;
    ServiceBundleCode: string;
    TrustSessionId?: string;
  };
}

export interface IGetAuthenticationQuestionsMsg {
  AccountCode?: string;
  AccountName?: string;
  AdditionalInputs?: {
    Data: {
      Name: string;
      Value: string;
    };
  };
  RequestKey: string;
  ClientKey: string;
  Customer: {
    CurrentAddress: {
      AddressLine1: string;
      AddressLine2?: string;
      City: string;
      State: string;
      Zipcode: string;
    };
    PreviousAddress: {
      AddressLine1?: string;
      AddressLine2?: string;
      City?: string;
      State?: string;
      Zipcode?: string;
    };
    DateOfBirth: string;
    FullName: {
      FirstName: string;
      LastName: string;
      MiddleName?: string;
      Prefix?: string;
      Suffix?: string;
    };
    PhoneNumber?: string;
    Ssn: string;
  };
  Email?: string;
  Language?: string;
  ServiceBundleCode: string;
  TrustSessionId?: string;
}

export interface IGetAuthenticationQuestionsResponse {
  Envelope: {
    Body: {
      GetAuthenticationQuestionsResponse: {
        GetAuthenticationQuestionsResult: IGetAuthenticationQuestionsResult;
      };
    };
  };
}

export interface IGetAuthenticationQuestionsResult extends IStandardResponse {
  Questions: string;
  ServiceBundleFulfillmentKey: string;
}
