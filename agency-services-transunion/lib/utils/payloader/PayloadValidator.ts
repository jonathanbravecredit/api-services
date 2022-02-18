import { ajv } from 'lib/schema/validation';

export class PayloadValidator {
  constructor() {}

  validate<P>(payload: P, schema: string): void {
    const validate = ajv.getSchema<P>(schema);
    if (!validate(payload)) throw `Malformed message=${payload}`;
  }
}
