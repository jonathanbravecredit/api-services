import { ICodeRef } from 'libs/interfaces/common.interface';
import { IFinancingStatement } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';

export class FinancingStatement extends Homogenize<IFinancingStatement> implements IFinancingStatement {
  CreditorType: ICodeRef;
  dateMaturity: string | null = null;

  constructor(_data: IFinancingStatement) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.CreditorType = new CodeRef(this.CreditorType);
  }
}
