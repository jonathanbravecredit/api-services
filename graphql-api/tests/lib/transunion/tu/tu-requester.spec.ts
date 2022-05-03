import { ACCOUNT_CODE, ACCOUNT_NAME } from 'libs/data/constants';
import { TURequester } from 'libs/transunion/tu/tu-requester';
import { Nested } from 'libs/utils/helpers/Nested';
import { APIRequestKeys, APIRequestLibrary, APIRequestXMLLibrary } from 'libs/utils/requests/requests';
import { Helper } from 'tests/helpers/test-helper';
import {
  MOCK_MAPPED,
  MOCK_MAPPED_XML,
  MOCK_PAYLOAD,
  MOCK_UNFLATTENED_OBJ_ALL,
  MOCK_UNFLATTENED_OBJ_BODY,
  MOCK_UNFLATTENED_XML_ALL,
  MOCK_UNFLATTENED_XML_BODY,
  REQ_WRAPPER_CONTAINING,
  XML_WRAPPER_CONTAINING,
} from 'tests/__mocks__/payloads';
import * as _ from 'lodash';
import * as convert from 'xml-js';
import { mocked } from 'ts-jest/utils';

jest.mock('lodash', () => {
  return {
    merge: jest.fn().mockImplementation(Object.assign),
    entries: jest.fn().mockImplementation(Object.entries),
    get: jest.fn().mockImplementation(() => {
      return null;
    }),
  };
});
const MOCK_XML = '<soapenv:Envelope></soapenv:Envelope>';
jest.mock('xml-js', () => {
  return {
    json2xml: jest.fn().mockImplementation(() => {
      return MOCK_XML;
    }),
  };
});

describe('TU Requester', () => {
  const payload = MOCK_PAYLOAD as any;
  const requestKey = APIRequestKeys.MOCK;
  let requester = new TURequester<any>(requestKey, payload);
  let h = new Helper<TURequester<any>>(requester);
  const mockedDash = mocked(_);
  const mockedConvert = mocked(convert);
  beforeEach(() => {
    jest.clearAllMocks();
    requester = new TURequester<any>(requestKey, payload);
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
    it('should have a property called requestObject', () => {
      expect(h.hasProperty(requester, 'requestObject')).toEqual(true);
      expect(requester.requestObject).toEqual({});
    });
    it('should have a property called requestXMLObject', () => {
      expect(h.hasProperty(requester, 'requestXMLObject')).toEqual(true);
      expect(requester.requestXMLObject).toEqual({});
    });
    it('should have a property called xml', () => {
      expect(h.hasProperty(requester, 'xml')).toEqual(true);
      expect(requester.xml).toEqual('');
    });
  });

  describe('Constructor step', () => {
    let requester2 = new TURequester<any>(requestKey, payload);
    it('should set requestMap', () => {
      const mapping = APIRequestLibrary[requester2.requestKey];
      expect(requester2.requestMap).toEqual(mapping);
    });
    it('should set requestXML', () => {
      const mapping = APIRequestXMLLibrary[requester2.requestKey];
      expect(requester2.requestXMLMap).toEqual(mapping);
    });
  });

  describe('createRequest method', () => {
    it('should call generateRequest from createRequest', () => {
      const spy = jest.spyOn(requester, 'generateRequestObject');
      requester.createRequest();
      expect(spy).toHaveBeenCalled();
    });
    it('should call generateXMLObject from createRequest', () => {
      const spy = jest.spyOn(requester, 'generateXMLObject').mockImplementation(jest.fn());
      requester.createRequest();
      expect(spy).toHaveBeenCalled();
    });
    it('should call convertXML from createRequest', () => {
      const spy = jest.spyOn(requester, 'convertXML').mockImplementation(jest.fn());
      requester.createRequest();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('generateRequestObject', () => {
    let parseSpy = jest.spyOn(requester, 'parseRequest');
    let unflattenSpy = jest.spyOn(Nested, 'unflatten');
    beforeEach(() => {
      parseSpy.mockImplementation().mockReturnValue(MOCK_MAPPED);
      unflattenSpy.mockImplementation().mockReturnValue(MOCK_UNFLATTENED_OBJ_BODY);
    });
    afterEach(() => {
      parseSpy.mockReset();
      unflattenSpy.mockReset();
    });
    it('should call getReqWrapper', () => {
      const spy = jest.spyOn(requester, 'getReqWrapper');
      requester.generateRequestObject();
      expect(spy).toHaveBeenCalled();
    });
    it('should call Nested.unflatten ', () => {
      const spy = jest.spyOn(Nested, 'unflatten');
      requester.generateRequestObject();
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });
    it('should call parseRequest with requestMap', () => {
      const spy = jest.spyOn(requester, 'parseRequest').mockImplementation().mockReturnValue(MOCK_MAPPED);
      requester.generateRequestObject();
      expect(spy).toHaveBeenCalledWith({ ...requester.requestMap });
    });
    it('should create the request correctly', () => {
      requester.generateRequestObject();
      // have to sync the request key as uuid
      requester.requestObject.RequestKey = 'BC-request-key';
      expect(requester.requestObject).toMatchObject(MOCK_UNFLATTENED_OBJ_ALL);
    });
  });

  describe('generareXMLObject', () => {
    let parseSpy = jest.spyOn(requester, 'parseXML');
    let unflattenSpy = jest.spyOn(Nested, 'unflatten');
    beforeEach(() => {
      parseSpy.mockImplementation().mockReturnValue(MOCK_MAPPED_XML);
      unflattenSpy.mockImplementation().mockReturnValue(MOCK_UNFLATTENED_XML_BODY);
    });
    afterEach(() => {
      parseSpy.mockReset();
      unflattenSpy.mockReset();
    });
    it('should call getXMLWrapper', () => {
      const spy = jest.spyOn(requester, 'getXMLWrapper');
      requester.generateXMLObject();
      expect(spy).toHaveBeenCalled();
    });
    it('should call Nested.unflatten ', () => {
      const spy = jest.spyOn(Nested, 'unflatten');
      requester.generateXMLObject();
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
    });
    it('should call parseXML with requestXMLMap', () => {
      const spy = jest.spyOn(requester, 'parseXML').mockImplementation().mockReturnValue(MOCK_MAPPED_XML);
      requester.generateXMLObject();
      expect(spy).toHaveBeenCalledWith({ ...requester.requestXMLMap });
    });
    it('should create the xml correctly', () => {
      requester.generateXMLObject();
      expect(requester.requestXMLObject).toMatchObject(MOCK_UNFLATTENED_XML_ALL);
    });
  });

  describe('getReqWrapper', () => {
    it('should return an object wrapped with the request defaults', () => {
      const wrapped = requester.getReqWrapper({});
      expect(wrapped).toEqual(expect.objectContaining(REQ_WRAPPER_CONTAINING));
    });
  });

  describe('getXMLWrapper', () => {
    it('should return an object wrapped with the XML envelope', () => {
      const wrapped = requester.getXMLWrapper({});
      expect(wrapped).toEqual(expect.objectContaining(XML_WRAPPER_CONTAINING));
    });
  });

  describe('parseRequest', () => {
    let requester2 = new TURequester<any>(requestKey, payload);
    it('should return empty object if payload is empty object', () => {
      requester2.payload = {};
      const test = requester2.parseRequest({ key: 'value' });
      expect(test).toMatchObject({});
    });
    it('should return empty object if payload is false', () => {
      requester2.payload = null;
      const test = requester2.parseRequest({ key: 'value' });
      expect(test).toMatchObject({});
    });
  });

  describe('parseXML', () => {
    let requester2 = new TURequester<any>(requestKey, payload);
    it('should return empty object if requestObject is empty object', () => {
      requester2.requestObject = {};
      const test = requester2.parseXML({ key: 'value' });
      expect(test).toMatchObject({});
    });
    it('should return empty object if requestObject is false', () => {
      requester2.requestObject = null;
      const test = requester2.parseXML({ key: 'value' });
      expect(test).toMatchObject({});
    });
  });

  describe('convertXML', () => {
    let requester2 = new TURequester<any>(requestKey, payload);
    let parseSpy = jest.spyOn(requester, 'parseRequest');
    let parseXMLSpy = jest.spyOn(requester, 'parseXML');
    let unflattenSpy = jest.spyOn(Nested, 'unflatten');
    let unflattenXMLSpy = jest.spyOn(Nested, 'unflatten');
    beforeEach(() => {
      parseSpy.mockImplementation().mockReturnValue(MOCK_MAPPED);
      unflattenSpy.mockImplementation().mockReturnValue(MOCK_UNFLATTENED_OBJ_BODY);
      parseXMLSpy.mockImplementation().mockReturnValue(MOCK_MAPPED_XML);
      unflattenXMLSpy.mockImplementation().mockReturnValue(MOCK_UNFLATTENED_XML_BODY);
    });
    afterEach(() => {
      parseSpy.mockReset();
      unflattenSpy.mockReset();
      parseXMLSpy.mockReset();
      unflattenXMLSpy.mockReset();
    });

    it('should NOT call convert.json2xml it requestXMLObject', () => {
      requester2.requestXMLObject = null;
      expect(mockedConvert.json2xml).not.toHaveBeenCalled();
    });
    it('should call convert.json2xml if requestXMLObject is set', () => {
      requester.createRequest();
      expect(mockedConvert.json2xml).toHaveBeenCalled();
    });
    it('should set the xml property to the output of the json2xml', () => {
      requester.createRequest();
      expect(requester.xml).toEqual(MOCK_XML);
    });
  });
});
