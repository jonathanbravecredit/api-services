import { IProxyRequest } from 'lib/interfaces';
import { IProxyHandlerResponse } from 'lib/interfaces/api/proxy-handler.interfaces';
import { updateDisputeAcknowledgements } from 'lib/utils/db/dynamo-db/dynamo';

export class AcknowledgeDisputeTerms {
  public result: IProxyHandlerResponse<boolean>;
  constructor(protected payload: IProxyRequest) {}

  async ackTerms(): Promise<void> {
    try {
      await updateDisputeAcknowledgements(this.payload.identityId);
      this.result = { success: true, error: null, data: null };
    } catch (err) {
      this.result = { success: false, error: err, data: null };
    }
  }
}
