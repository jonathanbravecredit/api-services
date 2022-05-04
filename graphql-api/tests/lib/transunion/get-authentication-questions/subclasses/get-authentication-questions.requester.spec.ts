import { ACCOUNT_CODE, ACCOUNT_NAME } from 'libs/data/constants';
import { GetAuthenticationQuestionsRequester } from 'libs/transunion/authentication-questions/subclasses/get-authentication-questions.requester';
import { APIRequestKeys } from 'libs/utils/requests/requests';
import { MOCK_GET_AUTH_PAYLOAD } from 'tests/__mocks__/payloads';

describe('GetAuthenticationQuestionsRequester', () => {
  const payload = MOCK_GET_AUTH_PAYLOAD as any;
  const requestKey = APIRequestKeys.GET_AUTHENTICATION_QUESTIONS;
  let requester = new GetAuthenticationQuestionsRequester(requestKey, payload);
  beforeEach(() => {
    jest.clearAllMocks();
    requester = new GetAuthenticationQuestionsRequester(requestKey, payload);
  });

  describe('getReqWrapper', () => {
    it('should wrap the body with the right keys', () => {
      const test = requester.getReqWrapper({});
      test.RequestKey = '';
      const mock = {
        AccountCode: ACCOUNT_CODE,
        AccountName: ACCOUNT_NAME,
        RequestKey: '',
      };
      expect(test).toEqual(expect.objectContaining(mock));
    });
  });
});
