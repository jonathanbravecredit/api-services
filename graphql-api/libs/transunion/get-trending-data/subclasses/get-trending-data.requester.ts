import { ACCOUNT_CODE, ACCOUNT_NAME } from 'libs/data/constants';
import { IGetTrendingDataSchema } from 'libs/interfaces';
import { APIRequester } from 'libs/models/api-requester.model';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { v4 } from 'uuid';

export class GetTrendingDataRequester extends TURequester<IGetTrendingDataSchema> implements APIRequester {
  constructor(requestKey: APIRequestKeys, payload: IGetTrendingDataSchema) {
    super(requestKey, payload);
  }

  getXMLWrapper(body: any): any {
    return {
      'soapenv:Envelope': {
        _attributes: {
          'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
          'xmlns:con': 'https://consumerconnectws.tui.transunion.com/',
          'xmlns:data': 'https://consumerconnectws.tui.transunion.com/data',
          'xmlns:arr': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
        },
        'soapenv:Header': {},
        ...body,
      },
    };
  }

  getReqWrapper(body: any): any {
    return {
      AccountCode: ACCOUNT_CODE,
      AccountName: ACCOUNT_NAME,
      AdditionalInputs: {
        Data: {
          Name: 'CreditReportVersion',
          Value: '7.1',
        },
      },
      RequestKey: `BC-${v4()}`,
      GetPartnerTrendingData: 'false',
      GetProductTrendingData: 'true',
      ProductDisplay: 'false',
      ...body,
    };
  }
}
