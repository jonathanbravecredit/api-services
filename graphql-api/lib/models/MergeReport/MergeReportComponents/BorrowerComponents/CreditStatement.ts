import { ICodeRef, ISource } from 'lib/interfaces/common.interface';
import { ICreditStatement } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { CodeRef } from 'lib/models/Common/CodeRef';
import { Source } from 'lib/models/Common/Source';

export class CreditStatement extends Homogenize<Partial<ICreditStatement>> implements ICreditStatement {
  StatementType: ICodeRef;
  Source: ISource;
  statement: string | null = null;

  constructor(_data: Partial<ICreditStatement>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.StatementType = new CodeRef(this.StatementType);
    this.Source = new Source(this.Source);
  }
}
