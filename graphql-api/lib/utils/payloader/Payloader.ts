import { PayloadPrepper } from 'lib/utils/payloader/PayloadPrepper';
import { PayloadValidator } from 'lib/utils/payloader/PayloadValidator';
import { applyMixins } from 'lib/utils/mixins/mixins';

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

export class Payloader<T> extends MixPayload()<T> {}
