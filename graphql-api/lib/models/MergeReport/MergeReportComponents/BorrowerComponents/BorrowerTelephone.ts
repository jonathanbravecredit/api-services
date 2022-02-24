import { ICodeRef, ISource } from 'lib/interfaces/common.interface';
import { IBorrowerTelephone, IPhoneNumber } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { CodeRef } from 'lib/models/Common/CodeRef';
import { Source } from 'lib/models/Common/Source';
import { PhoneNumber } from 'lib/models/MergeReport/MergeReportComponents/BorrowerComponents/PhoneNumber';

export class BorrowerTelephone extends Homogenize<Partial<IBorrowerTelephone>> implements IBorrowerTelephone {
  PhoneNumber: IPhoneNumber;
  PhoneType: ICodeRef;
  Source: ISource;
  partitionSet: number | string | null = null;
  dateReported: string | null = null;
  dateUpdated: string | null = null;

  constructor(_data: Partial<IBorrowerTelephone>) {
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
