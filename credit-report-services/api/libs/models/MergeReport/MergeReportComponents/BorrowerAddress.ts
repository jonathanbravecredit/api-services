import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { IBorrowerAddress, ICreditAddress } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';
import { Source } from 'libs/models/Common/Source';
import { CreditAddress } from 'libs/models/MergeReport/MergeReportComponents/CreditAddress';

export class BorrowerAddress extends Homogenize<IBorrowerAddress> implements IBorrowerAddress {
  CreditAddress: ICreditAddress;
  Dwelling: ICodeRef;
  Origin: ICodeRef;
  Ownership: ICodeRef;
  Source: ISource = new Source({});
  dateReported: string | null = null;
  addressOrder: number | null = null;
  partitionSet: number | null = null;

  constructor(_data: IBorrowerAddress) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.CreditAddress = !this.CreditAddress ? new CreditAddress({}) : new CreditAddress(this.CreditAddress); // for now
    this.Dwelling = !this.Dwelling ? new CodeRef({}) : new CodeRef(this.Dwelling);
    this.Origin = !this.Origin ? new CodeRef({}) : new CodeRef(this.Origin);
    this.Ownership = !this.Ownership ? new CodeRef({}) : new CodeRef(this.Ownership);
    this.Source = !this.Source ? new Source({}) : new Source(this.Source);
  }
}
