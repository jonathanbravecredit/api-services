import { Nested as _nest } from 'lib/utils/helpers/Nested';
import { IAttributes } from 'lib/interfaces';
import { ACCOUNT_CODE, ACCOUNT_NAME } from 'lib/data/constants';

/**
 * T = Data object (i.e AppData)
 * R = Request form
 */
export class TURequestBase<T> {
  protected accountCode: string = ACCOUNT_CODE;
  protected accountName: string = ACCOUNT_NAME;
  protected clientKey: string;
  protected enrollmentKey: string;
  protected serviceBundleCode: string;
  protected attributes: IAttributes;
  // protected xml: string;

  constructor(protected data: T) {}

  init() {
    const { id } = _nest.find(this.data, 'id');
    const { enrollmentKey } = _nest.find(this.data, 'enrollmentKey');
    const { userAttributes } = _nest.find(this.data, 'userAttributes');

    this.clientKey = id;
    this.enrollmentKey = enrollmentKey;
    this.attributes = userAttributes;
  }
}
