import { IStandardResponse } from 'libs/interfaces';
import { DobInput, SsnInput, NameInput, AddressInput } from 'src/api/api.service';

export interface IIndicativeEnrichmentRequest {
  dob: DobInput;
  ssn: SsnInput;
  name: NameInput;
  address: AddressInput;
  dobformatted: string;
}

export interface IIndicativeEnrichmentPayload extends IIndicativeEnrichmentRequest {
  id: string;
}

export interface IEnrichedIndicativeEnrichment {
  request: {
    AccountCode: string;
    AccountName: string;
    AdditionalInputs: {
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
      PreviousAddress?: {
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
      Ssn: string;
    };
    ServiceBundleCode: string;
  };
}

export interface IIndicativeEnrichmentMsg {
  AdditionalInputs: {
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
      AddressLine1: string;
      AddressLine2?: string;
      City: string;
      State: string;
      Zipcode: string;
    };
    DateOfBirth: string;
    FullName: {
      FirstName: string;
      LastName: string;
      MiddleName: string;
      Prefix?: string;
      Suffix?: string;
    };
    Ssn: string;
  };
  ServiceBundleCode: string;
}

export interface IIndicativeEnrichmentResponse {
  Envelope: {
    Body: {
      IndicativeEnrichmentResponse: {
        IndicativeEnrichmentResult: IIndicativeEnrichmentResult;
      };
    };
  };
}

export interface IIndicativeEnrichmentResult extends IStandardResponse {
  Customer: string;
  SSN: string;
}
