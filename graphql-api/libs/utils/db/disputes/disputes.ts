import {
  createDispute,
  deleteDispute,
  describeDisputes,
  getDispute,
  listDisputesById,
  updateDispute,
  updateDisputeResults,
} from 'libs/utils/db/disputes/queries/disputes.queries';
import * as generators from 'libs/utils/db/disputes/generators/disputes.generators';

export class DisputesUtil {
  constructor() {}

  // generic queries
  static create = createDispute;
  static get = getDispute;
  static update = updateDispute;
  static delete = deleteDispute;
  static list = listDisputesById;
  static describe = describeDisputes;
  // dispute results specific
  static updateResults = updateDisputeResults;
  static generators = generators;
}
