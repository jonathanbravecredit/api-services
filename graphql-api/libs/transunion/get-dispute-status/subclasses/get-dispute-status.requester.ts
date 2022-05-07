import { ACCOUNT_CODE, ACCOUNT_NAME } from 'libs/data/constants';
import { APIRequester } from 'libs/models/api-requester.model';
import {
  IGetDisputeStatusGraphQLResponse,
  IGetDisputeStatusSchema,
} from 'libs/transunion/get-dispute-status/get-dispute-status.interface';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { v4 } from 'uuid';

export class GetDisputeStatusRequester extends TURequester<IGetDisputeStatusGraphQLResponse> implements APIRequester {
  constructor(requestKey: APIRequestKeys, payload: IGetDisputeStatusGraphQLResponse) {
    super(requestKey, payload);
  }

  getReqWrapper(body: any): any {
    return {
      AccountCode: ACCOUNT_CODE,
      AccountName: ACCOUNT_NAME,
      RequestKey: `BC-${v4()}`,
      ...body,
    };
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
}
