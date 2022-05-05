import { IProxyRequest } from 'libs/interfaces/api/proxy-query.interfaces';
import { GetDisputeByUserAllV2 } from 'libs/transunion/get-dispute-by-user-all/get-dispute-by-user-all';
import { Dispute } from 'libs/utils/db/disputes/model/dispute.model';

export class GetDisputeByUserV2 extends GetDisputeByUserAllV2 {
  constructor(protected payload: IProxyRequest) {
    super(payload, 'GetCurrentDisputeByUser');
  }

  async run(): Promise<any> {
    try {
      this.runPayloader();
      const resp = await this.queryDisputes()[0];
      this.results = { success: true, error: null, data: resp };
      await this.logResults();
      return this.results;
    } catch (err) {
      this.logGenericError(this.prepped.id, err);
      this.results = { success: false, error: err, data: null };
      return this.results;
    }
  }

  async queryDisputes(): Promise<Dispute[]> {
    const disputes = await super.queryDisputes();
    return disputes.sort((a, b) => {
      return new Date(b.createdOn).valueOf() - new Date(a.createdOn).valueOf();
    });
  }
}
