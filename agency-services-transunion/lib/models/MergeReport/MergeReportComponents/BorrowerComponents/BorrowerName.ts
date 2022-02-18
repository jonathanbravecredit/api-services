import { ICodeRef, ISource } from 'lib/interfaces/common.interface';
import { IBorrowerName, IName } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { CodeRef } from 'lib/models/Common/CodeRef';
import { Source } from 'lib/models/Common/Source';
import { Name } from 'lib/models/MergeReport/MergeReportComponents/BorrowerComponents/Name';

export class BorrowerName extends Homogenize<Partial<IBorrowerName>> implements IBorrowerName {
  Name: IName;
  NameType: ICodeRef;
  Source: ISource;
  partitionSet: number | string | null = null;
  dateReported: string | null = null;
  dateUpdated: string | null = null;

  constructor(_data: Partial<IBorrowerName>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Name = new Name(this.Name);
    this.NameType = new CodeRef(this.NameType);
    this.Source = new Source(this.Source);
  }
}
