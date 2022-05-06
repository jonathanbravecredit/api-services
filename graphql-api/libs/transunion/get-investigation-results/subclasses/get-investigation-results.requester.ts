import { ACCOUNT_CODE, ACCOUNT_NAME } from 'libs/data/constants';
import { APIRequester } from 'libs/models/api-requester.model';
import { IGetInvestigationResultsGraphQLResponse } from 'libs/transunion/get-investigation-results/get-investigation-results.interface';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { v4 } from 'uuid';

export class GetInvestigationResultsRequester
  extends TURequester<IGetInvestigationResultsGraphQLResponse>
  implements APIRequester
{
  constructor(requestKey: APIRequestKeys, payload: IGetInvestigationResultsGraphQLResponse) {
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
        },
        'soapenv:Header': {},
        ...body,
      },
    };
  }
}
