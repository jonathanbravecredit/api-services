import { ICodeRef } from 'libs/interfaces/common.interface';
import { IMessage } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';

export class Message extends Homogenize<Partial<IMessage>> implements IMessage {
  Code: ICodeRef;
  Type: ICodeRef;

  constructor(_data: Partial<IMessage>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Code = new CodeRef(this.Code);
    this.Type = new CodeRef(this.Type);
  }
}
