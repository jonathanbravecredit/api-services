import { TUResponder } from 'libs/transunion/tu/tu-responder';
import { Helper } from 'tests/helpers/test-helper';
import * as fastXml from 'fast-xml-parser';
import { mocked } from 'ts-jest/utils';

const mockedParseReturn = { req: 'test' };
jest.mock('fast-xml-parser', () => {
  return {
    parse: jest.fn().mockImplementation(() => {
      return mockedParseReturn;
    }),
  };
});

describe('TUResponder', () => {
  let responder = new TUResponder<any, any>();
  let h = new Helper<TUResponder<any, any>>(responder);
  const mockedParser = mocked(fastXml);
  beforeEach(() => {
    jest.clearAllMocks();
    responder = new TUResponder<any, any>();
    h = new Helper<TUResponder<any, any>>(responder);
  });

  describe('Properties and methods', () => {
    it('should have a property named response', () => {
      responder.response = '';
      expect(h.hasProperty(responder, 'response')).toEqual(true);
    });
    it('should have a property named xml', () => {
      responder.xml = '';
      expect(h.hasProperty(responder, 'xml')).toEqual(true);
    });
    it('should have a property named enriched', () => {
      expect(h.hasProperty(responder, 'enriched')).toEqual(true);
    });
    it('should have a method named parseResponse', () => {
      expect(h.hasMethod(responder, 'parseResponse')).toEqual(true);
    });
    it('should have a method named enrichData', () => {
      expect(h.hasMethod(responder, 'enrichData')).toEqual(true);
    });
  });

  describe('parseResponse', () => {
    it('should throw an error if the xml property is not configured', () => {
      expect(() => responder.parseResponse(null)).toThrow('No XML set');
    });
    it('should call fastXml.parse if xml is set', () => {
      const mockXML = '<mock></mock>';
      const mockOption = { option: 'option' };
      responder.xml = mockXML;
      responder.parseResponse(mockOption);
      expect(mockedParser.parse).toHaveBeenCalledWith(mockXML, mockOption);
    });
    it('should set response to the parsed xml', () => {
      const mockXML = '<mock></mock>';
      const mockOption = { option: 'option' };
      responder.xml = mockXML;
      responder.parseResponse(mockOption);
      expect(responder.response).toEqual(mockedParseReturn);
    });
  });

  describe('enrichData', () => {
    it('should return enrich when enrichData is called', () => {
      responder.enriched = 'enriched';
      const test = responder.enrichData(null);
      expect(test).toEqual('enriched');
    });
  });
});
