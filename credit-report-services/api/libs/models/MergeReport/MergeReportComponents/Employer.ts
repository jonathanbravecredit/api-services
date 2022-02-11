import { ISource } from 'libs/interfaces/common.interface';
import { IEmployer, ICreditAddress } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { Source } from 'libs/models/Common/Source';
import { CreditAddress } from 'libs/models/MergeReport/MergeReportComponents/CreditAddress';

export class Employer extends Homogenize<IEmployer> implements IEmployer {
  CreditAddress: ICreditAddress;
  Source: ISource;
  name: string;

  constructor(_data: IEmployer) {
    super(_data);
    this.homogenize(_data);
  }

  init(): void {
    this.CreditAddress = new CreditAddress(this.CreditAddress);
    this.Source = new Source(this.Source);
  }
}
