import { ICodeRef } from 'libs/interfaces/common.interface';
import { ICreditScoreFactor } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';

export class CreditScoreFactor extends Homogenize<ICreditScoreFactor> implements ICreditScoreFactor {
  Factor: ICodeRef;
  FactorText: string[] = [];
  FactorType: 'Negative' | 'Positive' | null = null;
  bureauCode: number | null = null;

  constructor(_data: ICreditScoreFactor) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Factor = new CodeRef(this.Factor);
  }
}
