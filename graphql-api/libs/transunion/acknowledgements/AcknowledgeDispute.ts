import { IProxyRequest } from 'libs/interfaces';
import { IProxyHandlerResponse } from 'libs/interfaces/api/proxy-handler.interfaces';
import { updateDisputeAcknowledgements } from 'libs/utils/db/dynamo-db/dynamo';
import { LoggerTransactionals } from 'libs/utils/logger/LoggerTransactionals';

export class AcknowledgeDisputeTerms extends LoggerTransactionals {
  public results: IProxyHandlerResponse<null>;
  constructor(protected payload: IProxyRequest) {
    super('AcknowledgeDisputeTerms');
  }

  async ackTerms(): Promise<IProxyHandlerResponse<any>> {
    try {
      const res = await updateDisputeAcknowledgements(this.payload.identityId);
      this.results = { success: true, error: null, data: res };
      await this.log(this.payload.identityId, this.results, 'GENERIC');
      return this.results;
    } catch (err) {
      this.results = { success: false, error: err, data: null };
      return this.results;
    }
  }
}
