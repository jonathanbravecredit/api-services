import { ICodeRef, IRemark } from 'libs/interfaces/common.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';

export class Remark extends Homogenize<IRemark> implements IRemark {
  RemarkCode: ICodeRef;
  customRemark: string;

  constructor(_data: IRemark) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.RemarkCode = new CodeRef(this.RemarkCode);
  }
}
