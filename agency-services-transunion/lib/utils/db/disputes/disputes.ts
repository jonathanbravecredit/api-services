import {
  createDispute,
  deleteDispute,
  describeDisputes,
  getDispute,
  updateDispute,
} from 'lib/utils/db/disputes/queries/disputes.queries';
import * as generators from 'lib/utils/db/disputes/generators/disputes.generators';

export class DisputesUtil {
  constructor() {}

  static create = createDispute;
  static get = getDispute;
  static update = updateDispute;
  static delete = deleteDispute;
  static list = getDispute;
  static describe = describeDisputes;
  static generators = generators;
}
