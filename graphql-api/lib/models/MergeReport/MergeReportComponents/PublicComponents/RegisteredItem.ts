import { ICodeRef } from 'lib/interfaces/common.interface';
import { IRegisteredItem } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { CodeRef } from 'lib/models/Common/CodeRef';

export class RegisteredItem extends Homogenize<Partial<IRegisteredItem>> implements IRegisteredItem {
  Security: ICodeRef[] = [];
  originalBalance: number | string | null = null;
  dateMatures: string | null = null;

  constructor(_data: Partial<IRegisteredItem>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Security = this.homogenizeArray<ICodeRef, CodeRef>(this.Security, CodeRef);
  }
}
