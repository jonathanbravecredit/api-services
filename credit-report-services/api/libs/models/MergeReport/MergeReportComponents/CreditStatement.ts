import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { ICreditStatement } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';
import { Source } from 'libs/models/Common/Source';

export class CreditStatement extends Homogenize<ICreditStatement> implements ICreditStatement {
  StatementType: ICodeRef;
  Source: ISource;
  statement: string | null = null;

  constructor(_data: ICreditStatement) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.StatementType = new CodeRef(this.StatementType);
    this.Source = new Source(this.Source);
  }
}
