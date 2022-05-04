import 'reflect-metadata';
import { TUAPIProcessor } from 'libs/transunion/tu/tu-api';
import { TUResponder } from 'libs/transunion/tu/tu-responder';
import { createTransactionLog } from 'libs/utils/db/logger/queries/api-transaction.queries';
import { Helper } from 'tests/helpers/test-helper';
import { SoapV2 } from 'libs/utils/soap-aid/SoapV2';
import { Payloader } from 'libs/utils/payloader/Payloader';
import { mocked } from 'ts-jest/utils';

jest.mock('libs/utils/db/logger/queries/api-transaction.queries', () => {
  return Promise.resolve(null);
});

describe('TUAPIProcessor', () => {
  const action = 'MockAction';
  const payload = {
    agent: 'agent',
    auth: 'auth',
  } as any;

  const mockedQuery = mocked(createTransactionLog);

  let processor = new TUAPIProcessor<any, any, any, any>(
    action,
    payload,
    new TUResponder<any, any>(),
    new Payloader<any>(),
    new SoapV2(),
  );
  let h = new Helper<TUAPIProcessor<any, any, any, any>>(processor);
  // let logSpy = jest.spyOn(processor, 'log').mockImplementation().mockReturnValue(Promise.resolve(null));

  // beforeAll(() => {
  //   processor = new TUAPIProcessor<any, any, any>(
  //     action,
  //     payload,
  //     new TUResponder<any, any>(),
  //     new Payloader<any>(),
  //     new SoapV2(),
  //   );
  //   h = new Helper<TUAPIProcessor<any, any, any>>(processor);
  //   logSpy = jest.spyOn(processor, 'log').mockImplementation().mockReturnValue(Promise.resolve(null));
  // });

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
    let payloaderSpy = jest.spyOn(processor, 'runPayloader').mockReturnValue(null);
    let requesterSpy = jest.spyOn(processor, 'runRequester').mockReturnValue(null);
    let runSendAndSyncSpy = jest.spyOn(processor, 'runSendAndSync').mockReturnValue(Promise.resolve(null));
    let logResultsSpy = jest.spyOn(processor, 'logResults').mockReturnValue(Promise.resolve(null));
    beforeEach(() => {
      payloaderSpy.mockClear();
      requesterSpy.mockClear();
      runSendAndSyncSpy.mockClear();
      logResultsSpy.mockClear();
    });
    it('should call runPayloader', async () => {
      await processor.run();
      expect(payloaderSpy).toHaveBeenCalled();
    });
    it('should call runRequester', async () => {
      await processor.run();
      expect(requesterSpy).toHaveBeenCalled();
    });
    it('should call runSendAndSync', async () => {
      await processor.run();
      expect(runSendAndSyncSpy).toHaveBeenCalledWith('agent', 'auth');
    });
    it('should call logResults', async () => {
      await processor.run();
      expect(logResultsSpy).toHaveBeenCalled();
    });
    it('should call logGenericError if error thrown', async () => {
      logResultsSpy.mockRejectedValue('Async error');
      const spy = jest.spyOn(processor, 'logGenericError'); //.mockReturnValue(Promise.resolve(null));
      await processor.run();
      expect(spy).toHaveBeenCalled();
      spy.mockReset();
    });
  });

  describe('runPayloader', () => {
    let validateSpy = jest.spyOn(processor.payloader, 'validate').mockReturnValue();
    beforeEach(() => {
      validateSpy.mockClear();
    });
    it('should call prepPayload', () => {
      const spy = jest.spyOn(processor, 'prepPayload');
      processor.runPayloader();
      expect(spy).toHaveBeenCalled();
    });
    it('should call payloader.validate', () => {
      processor.runPayloader();
      expect(validateSpy).toHaveBeenCalled();
    });
    it('should call set gqldata to payloader.data', () => {
      processor.payloader.data = 'payloader.data';
      processor.runPayloader();
      expect(processor.gqldata).toEqual('payloader.data');
    });
  });
});
