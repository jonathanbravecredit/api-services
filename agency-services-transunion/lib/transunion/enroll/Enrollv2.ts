import * as https from 'https';
import { SyncV2 } from 'lib/utils/sync/SyncV2';
import { SoapV2 } from 'lib/utils/soap-aid/SoapV2';
import { Nested as _nest } from 'lib/utils/helpers/Nested';
import { Payloader } from 'lib/utils/payloader/Payloader';
import { qryGetDataForEnrollment } from 'lib/queries';
import { IEnrollGraphQLResponse, IEnrollResponse, IEnrollResult, IGenericRequest, IProxyRequest } from 'lib/interfaces';
import { DEFAULT_PARSER_OPTIONS } from 'lib/utils/parser/options';
import { IProxyHandlerResponse } from 'lib/interfaces/api/proxy-handler.interfaces';
import { UpdateAppDataInput } from 'src/api/api.service';
import { EnrollRequester } from 'lib/transunion/enroll/subclasses/EnrollRequester';
import { EnrollResponder } from 'lib/transunion/enroll/subclasses/EnrollResponder';
import { LoggerTransactionals } from 'lib/utils/logger/LoggerTransactionals';

export class Enroll extends LoggerTransactionals {
  protected reqXML: string;
  protected resXML: string;
  protected data: IEnrollGraphQLResponse;
  protected action = 'Enroll';
  protected parserOptions = DEFAULT_PARSER_OPTIONS;
  protected response: IEnrollResponse;
  protected responseType: string;
  protected responseError: any;
  protected results: IProxyHandlerResponse<IEnrollResult>;

  constructor(protected payload: IProxyRequest) {
    super('Enroll');
  }

  async run(): Promise<IProxyHandlerResponse<IEnrollResult>> {
    const { accountCode, username, message, agent, auth, identityId } = this.payload;
    try {
      // prep the payload
      await this.runPayloader(identityId);
      // generate the request and request XML
      const requester = new EnrollRequester(this.data);
      this.runRequester<EnrollRequester>(requester);
      // parse, send to TU, and sync response to DB
      const responder = new EnrollResponder();
      await this.runSendAndSync<EnrollResponder>(agent, auth, identityId, responder);
      // log the results
      await this.logResults(identityId);
      // send the results back to gql
      return this.results;
    } catch (err) {
      await this.logGenericError(identityId, err);
      return { success: false, data: null, error: err };
    }
  }

  async runPayloader(id: string): Promise<IEnrollGraphQLResponse> {
    // prep the payload
    const payload: IGenericRequest = { id };
    const payloader = new Payloader<IEnrollGraphQLResponse>();
    payloader.validate<IGenericRequest>(payload, 'getRequest');
    // query and prep
    const qry = qryGetDataForEnrollment;
    payloader.prep<IGenericRequest>(qry, payload);
    this.data = payloader.data;
    return this.data;
  }

  runRequester<T extends EnrollRequester>(requester: T): string {
    // const requester = new FulfillRequester(this.action, this.data);
    requester.generateRequest();
    requester.generateXML();
    const { xml } = requester;
    this.reqXML = xml;
    return this.reqXML;
  }

  async runSendAndSync<T extends EnrollResponder>(
    agent: https.Agent,
    auth: string,
    id: string,
    responder: T,
  ): Promise<void> {
    const soap = new SoapV2();
    await soap.sendRequest(agent, auth, this.action, this.parserOptions, this.reqXML);

    const sync = new SyncV2();
    await sync.getCleanData({ id });
    // this is odd that the responder is in between sync calls
    // set the xml in the respond to the response from soap
    responder.xml = soap.response;
    responder.parseResponse(this.parserOptions);
    responder.enrichData(sync.clean);

    this.response = responder.response;
    this.responseType = responder.responseType;
    this.responseError = responder.responseError;

    this.setResults(sync, responder.enriched);
  }

  async setResults(sync: SyncV2, enriched: UpdateAppDataInput): Promise<void> {
    if (this.responseType.toLowerCase() === 'success') {
      const syncd = await sync.syncData(enriched);
      const data = _nest.find<IEnrollResult>(this.response, 'EnrollResult');
      this.results = syncd
        ? { success: true, error: null, data: data }
        : { success: false, error: 'failed to sync data to db' };
    } else {
      this.results =
        `${this.responseError.Code}` == '103045'
          ? { success: true, error: null, data: null }
          : { success: false, error: this.responseError, data: null };
    }
  }

  async logResults(id: string): Promise<void> {
    this.log(id, { ...this }, 'TRANSUNION');
  }
}
