import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { IBorrowerTelephone, IPhoneNumber } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';
import { Source } from 'libs/models/Common/Source';
import { PhoneNumber } from 'libs/models/MergeReport/MergeReportComponents/BorrowerComponents/PhoneNumber';

export class BorrowerTelephone extends Homogenize<IBorrowerTelephone> implements IBorrowerTelephone {
  PhoneNumber: IPhoneNumber;
  PhoneType: ICodeRef;
  Source: ISource;

  constructor(_data: IBorrowerTelephone) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.PhoneNumber = new PhoneNumber(this.PhoneNumber);
    this.PhoneType = new CodeRef(this.PhoneType);
    this.Source = new Source(this.Source);
  }
}
