import { ICodeRef, IRemark } from 'lib/interfaces/common.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { CodeRef } from 'lib/models/Common/CodeRef';

export class Remark extends Homogenize<Partial<IRemark>> implements IRemark {
  RemarkCode: ICodeRef;
  customRemark: string;

  constructor(_data: Partial<IRemark>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.RemarkCode = new CodeRef(this.RemarkCode);
  }
}
