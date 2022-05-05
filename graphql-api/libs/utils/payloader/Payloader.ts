import { PayloadPrepper } from 'libs/utils/payloader/PayloadPrepper';
import { PayloadValidator } from 'libs/utils/payloader/PayloadValidator';
import { applyMixins } from 'libs/utils/mixins/mixins';

class PayloadBase<T> {
  constructor() {}
}

interface PayloadBase<T> extends PayloadPrepper<T>, PayloadValidator {}

export function MixPayload() {
  applyMixins(PayloadBase, [PayloadPrepper, PayloadValidator]);
  return class Payloader<T> extends PayloadBase<T> {
    constructor() {
      super();
    }
  };
}

/**
 * T = GraphQL returning data structure
 */
export class Payloader<T> extends MixPayload()<T> {}
