import { ACCOUNT_CODE, ACCOUNT_NAME } from 'libs/data/constants';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { Nested } from 'libs/utils/helpers/Nested';
import { APIRequestKeys, APIRequestLibrary, APIRequestXMLLibrary } from 'libs/utils/requests/requests';
import { Helper } from 'tests/helpers/test-helper';
import { MOCK_MAPPED, MOCK_PAYLOAD, MOCK_UNFLATTENED_MAP } from 'tests/__mocks__/payloads';
import * as _ from 'lodash';
import { mocked } from 'ts-jest/utils';

jest.mock('lodash', () => {
  return {
    merge: jest.fn().mockImplementation(() => {
      return {};
    }),
    entries: jest.fn().mockImplementation(() => {
      return [];
    }),
  };
});

describe('TU Requester', () => {
  const payload = MOCK_PAYLOAD as any;
  const requestKey = APIRequestKeys.MOCK;
  let requester = new TURequester<any>(requestKey, payload, 'mockBundleCode');
  let h = new Helper<TURequester<any>>(requester);
  const mockedDash = mocked(_);
  beforeEach(() => {
    jest.clearAllMocks();
    requester = new TURequester<any>(requestKey, payload, 'mockBundleCode');
  });
  describe('Properties and methods', () => {
    it('should have a property called accountCode', () => {
      expect(h.hasProperty(requester, 'accountCode')).toEqual(true);
      expect(requester.accountCode).toEqual(ACCOUNT_CODE);
    });
    it('should have a property called accountName', () => {
      expect(h.hasProperty(requester, 'accountName')).toEqual(true);
      expect(requester.accountName).toEqual(ACCOUNT_NAME);
    });
    it('should have a property called request', () => {
      expect(h.hasProperty(requester, 'request')).toEqual(true);
      expect(requester.request).toEqual(null);
    });
    it('should have a property called xml', () => {
      expect(h.hasProperty(requester, 'xml')).toEqual(true);
      expect(requester.xml).toEqual('');
    });
    it('should have a property called xmlObject', () => {
      expect(h.hasProperty(requester, 'xmlObject')).toEqual(true);
      expect(requester.xmlObject).toEqual(null);
    });
  });

  describe('Constructor step', () => {
    let requester2 = new TURequester<any>(requestKey, payload, 'mockBundleCode');
    it('should set requestMap', () => {
      const mapping = APIRequestLibrary[requester2.requestKey];
      expect(requester2.requestMap).toEqual(mapping);
    });
    it('should set requestXML', () => {
      const mapping = APIRequestXMLLibrary[requester2.requestKey];
      expect(requester2.requestXML).toEqual(mapping);
    });
  });

  describe('Run method', () => {
    it('should call generateRequest from run', () => {
      const spy = jest.spyOn(requester, 'generateRequest').mockImplementation(jest.fn());
      requester.run();
      expect(spy).toHaveBeenCalled();
    });
    it('should call addRequestDefaults from run', () => {
      const spy = jest.spyOn(requester, 'addRequestDefaults').mockImplementation(jest.fn());
      requester.run();
      expect(spy).toHaveBeenCalled();
    });
    it('should call generateXMLObject from run', () => {
      const spy = jest.spyOn(requester, 'generateXMLObject').mockImplementation(jest.fn());
      requester.run();
      expect(spy).toHaveBeenCalled();
    });
    it('should call addXMLDefaults from run', () => {
      const spy = jest.spyOn(requester, 'addXMLDefaults').mockImplementation(jest.fn());
      requester.run();
      expect(spy).toHaveBeenCalled();
    });
    it('should call convertXML from run', () => {
      const spy = jest.spyOn(requester, 'convertXML').mockImplementation(jest.fn());
      requester.run();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('generateRequests', () => {
    it('should call Nested.unflatten ', () => {
      const spy = jest.spyOn(Nested, 'unflatten');
      requester.generateRequest();
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });
    it('should call parseRequest', () => {
      const spy = jest.spyOn(requester, 'parseRequest');
      requester.generateRequest();
      expect(spy).toHaveBeenCalledWith({ ...requester.requestMap });
    });
    it('should unflatten the map correctly', () => {
      jest.spyOn(requester, 'parseRequest').mockReturnValue(MOCK_MAPPED);
      requester.generateRequest();
      console.log(requester.request);
      expect(requester.request).toMatchObject(MOCK_UNFLATTENED_MAP);
    });
  });
});
