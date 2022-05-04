import 'reflect-metadata';
import { IProxyRequest } from 'libs/interfaces/api/proxy-query.interfaces';
import { TUAPIProcessor } from 'libs/transunion/tu/tu-api';
import { TUResponder } from 'libs/transunion/tu/tu-responder';
import { createTransactionLog } from 'libs/utils/db/logger/queries/api-transaction.queries';
import { Helper } from 'tests/helpers/test-helper';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { mocked } from 'ts-jest/utils';

jest.mock('libs/utils/soap-aid/SoapV2', () => {
  return {
    sendRequest: jest.fn().mockImplementation((arg0, arg1, arg2, arg3, arg4) => {
      return Promise.resolve(null);
    }),
  };
});

jest.mock('libs/transunion/tu/tu-responder', () => {
  return {
    xml: '',
    parseResponse: jest.fn().mockImplementation((arg0) => {
      return null;
    }),
  };
});

jest.mock('libs/utils/db/logger/queries/api-transaction.queries', () => {
  return Promise.resolve(null);
});

jest.mock('libs/utils/payloader/Payloader', () => {
  return {
    validate: jest.fn().mockImplementation((arg0, arg1) => {
      return true;
    }),
  };
});
describe('TUAPIProcessor', () => {
  const action = 'MockAction';
  const payload = {
    agent: 'agent',
    auth: 'auth',
  } as any;
  const responder = TUResponder;
  let processor = new TUAPIProcessor<any, any, any>('MockAction', payload, responder);
  let h = new Helper<TUAPIProcessor<any, any, any>>(processor);
  let logSpy = jest.spyOn(processor, 'log').mockImplementation().mockReturnValue(Promise.resolve(null));

  const mockedSoap = mocked(SoapV2);
  const mockedResponder = mocked(TUResponder);
  const mockedPayloader = mocked(Payloader);
  const mockedQuery = mocked(createTransactionLog);

  beforeAll(() => {
    processor = new TUAPIProcessor<any, any, any>('MockAction', payload, responder);
    h = new Helper<TUAPIProcessor<any, any, any>>(processor);
    logSpy = jest.spyOn(processor, 'log').mockImplementation().mockReturnValue(Promise.resolve(null));
  });

  describe('Properties and methods', () => {
    it('should have a property named reqXML', () => {
      processor.reqXML = '';
      expect(h.hasProperty(processor, 'reqXML')).toEqual(true);
    });
    it('should have a property named resXML', () => {
      processor.resXML = '';
      expect(h.hasProperty(processor, 'resXML')).toEqual(true);
    });
    it('should have a property named gqldata', () => {
      processor.gqldata = '';
      expect(h.hasProperty(processor, 'gqldata')).toEqual(true);
    });
    it('should have a property named prepped', () => {
      processor.prepped = '';
      expect(h.hasProperty(processor, 'prepped')).toEqual(true);
    });
    it('should have a property named response', () => {
      processor.response = '';
      expect(h.hasProperty(processor, 'response')).toEqual(true);
    });
    it('should have a property named responseType', () => {
      processor.responseType = '';
      expect(h.hasProperty(processor, 'responseType')).toEqual(true);
    });
    it('should have a property named responseError', () => {
      processor.responseError = '';
      expect(h.hasProperty(processor, 'responseError')).toEqual(true);
    });
    it('should have a property named responseResult', () => {
      processor.responseResult = '';
      expect(h.hasProperty(processor, 'responseResult')).toEqual(true);
    });
    it('should have a property named results', () => {
      processor.results = '' as any;
      expect(h.hasProperty(processor, 'results')).toEqual(true);
    });
    it('should have a property named parserOptions', () => {
      expect(h.hasProperty(processor, 'parserOptions')).toEqual(true);
    });
    xit('should have a property named payloader', () => {
      expect(h.hasProperty(processor, 'payloader')).toEqual(true);
    });
    it('should have a property named schema', () => {
      expect(h.hasProperty(processor, 'schema')).toEqual(true);
    });
    it('should have a property named resultKey', () => {
      expect(h.hasProperty(processor, 'resultKey')).toEqual(true);
    });
    it('should have a property named serviceBundleCode', () => {
      expect(h.hasProperty(processor, 'serviceBundleCode')).toEqual(true);
    });
    it('should have a method named run', () => {
      expect(h.hasMethod(processor, 'run')).toEqual(true);
    });
    it('should have a method named runPayloader', () => {
      expect(h.hasMethod(processor, 'runPayloader')).toEqual(true);
    });
    it('should have a method named prepPayload', () => {
      expect(h.hasMethod(processor, 'prepPayload')).toEqual(true);
    });
    it('should have a method named runRequester', () => {
      expect(h.hasMethod(processor, 'runRequester')).toEqual(true);
    });
    it('should have a method named runSendAndSync', () => {
      expect(h.hasMethod(processor, 'runSendAndSync')).toEqual(true);
    });
    it('should have a method named setResponses', () => {
      expect(h.hasMethod(processor, 'setResponses')).toEqual(true);
    });
    it('should have a method named setSuccessResults', () => {
      expect(h.hasMethod(processor, 'setSuccessResults')).toEqual(true);
    });
    it('should have a method named setFailedResults', () => {
      expect(h.hasMethod(processor, 'setFailedResults')).toEqual(true);
    });
    it('should have a method named logResults', () => {
      expect(h.hasMethod(processor, 'logResults')).toEqual(true);
    });
  });

  describe('run method', () => {
    it('should call runPayloader', async () => {
      const spy = jest.spyOn(processor, 'runPayloader').mockReturnValue(Promise.resolve(null));
      await processor.run();
      expect(spy).toHaveBeenCalled();
    });
    it('should call runRequester', async () => {
      const spy = jest.spyOn(processor, 'runRequester').mockReturnValue(null);
      await processor.run();
      expect(spy).toHaveBeenCalled();
    });
    it('should call runSendAndSync', async () => {
      const spy = jest.spyOn(processor, 'runSendAndSync').mockReturnValue(Promise.resolve(null));
      await processor.run();
      expect(spy).toHaveBeenCalledWith('agent', 'auth');
    });
    it('should call logResults', async () => {
      const spy = jest.spyOn(processor, 'logResults').mockReturnValue(Promise.resolve(null));
      await processor.run();
      expect(spy).toHaveBeenCalled();
    });
  });
});
