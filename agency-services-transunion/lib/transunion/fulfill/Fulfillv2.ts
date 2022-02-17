import * as https from 'https';
import { Nested as _nest } from 'lib/utils/helpers/Nested';
import { SyncV2 } from 'lib/utils/sync/SyncV2';
import { SoapV2 } from 'lib/utils/soap-aid/SoapV2';
import { Payloader } from 'lib/utils/payloader/Payloader';
import { FulfillRequester } from 'lib/transunion/fulfill/subclasses/FulfillRequester';
import { FulfillResponder } from 'lib/transunion/fulfill/subclasses/FulfillResponder';
import { qryGetDataForFulfill } from 'lib/queries';
import {
  IFulfillGraphQLResponse,
  IFulfillResponse,
  IFulfillResult,
  IGenericRequest,
  IProxyRequest,
} from 'lib/interfaces';
import { DEFAULT_PARSER_OPTIONS } from 'lib/utils/parser/options';
import { IProxyHandlerResponse } from 'lib/interfaces/api/proxy-handler.interfaces';
import { UpdateAppDataInput } from 'src/api/api.service';
import { LoggerTransactionals } from 'lib/utils/logger/LoggerTransactionals';

export class Fulfill extends LoggerTransactionals {
  protected reqXML: string;
  protected resXML: string;
  protected data: IFulfillGraphQLResponse;
  protected action = 'Fulfill';
  protected parserOptions = DEFAULT_PARSER_OPTIONS;
  protected response: IFulfillResponse;
  protected responseType: string;
  protected responseError: any;
  protected results: IProxyHandlerResponse<IFulfillResult>;

  constructor(protected payload: IProxyRequest) {
    super('Fulfill');
  }

  async run(): Promise<IProxyHandlerResponse<IFulfillResult>> {
    const { accountCode, username, message, agent, auth, identityId } = this.payload;
    try {
      // prep the payload
      await this.runPayloader();
      // generate the request and request XML
      const requester = new FulfillRequester(this.action, this.data);
      this.runRequester<FulfillRequester>(requester);
      // parse, send to TU, and sync response to DB
      const responder = new FulfillResponder(this.action);
      await this.runSendAndSync<FulfillResponder>(agent, auth, identityId, responder);
      // log the results
      await this.logResults();
      // send the results back to gql
      return this.results;
    } catch (err) {
      return { success: false, data: null, error: err };
    }
  }

  async runPayloader(): Promise<IFulfillGraphQLResponse> {
    // prep the payload
    const payload: IGenericRequest = { id: this.payload.identityId };
    const payloader = new Payloader<IFulfillGraphQLResponse>();
    payloader.validate<IGenericRequest>(payload, 'getRequest');
    // query and prep
    const qry = qryGetDataForFulfill;
    payloader.prep<IGenericRequest>(qry, payload);
    this.data = payloader.data;
    return this.data;
  }

  runRequester<T extends FulfillRequester>(requester: T): string {
    // const requester = new FulfillRequester(this.action, this.data);
    requester.generateRequest();
    requester.generateXML();
    const { xml } = requester;
    this.reqXML = xml;
    return this.reqXML;
  }

  async runSendAndSync<T extends FulfillResponder>(
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
    this.responseError = responder.responseError;
    this.responseType = responder.responseType;

    this.setResults(sync, responder.enriched);
  }

  async setResults(sync: SyncV2, enriched: UpdateAppDataInput): Promise<void> {
    if (this.responseType.toLowerCase() === 'success') {
      const syncd = await sync.syncData(enriched);
      const data = _nest.find<IFulfillResult>(this.response, 'FulfillResult');
      this.results = syncd
        ? { success: true, error: null, data: data }
        : { success: false, error: 'failed to sync data to db' };
    } else {
      this.results = { success: false, error: this.responseError };
    }
  }

  async logResults(): Promise<void> {
    const id = this.payload.identityId;
    this.log(id, { ...this }, 'TRANSUNION');
    await this.log(id, this.results, 'GENERIC');
  }
}
