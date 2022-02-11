import { ICodeRef, ISource } from 'libs/interfaces/common.interface';
import { IBorrowerName, IName } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';
import { Source } from 'libs/models/Common/Source';
import { Name } from 'libs/models/MergeReport/MergeReportComponents/Name';

export class BorrowerName extends Homogenize<IBorrowerName> implements IBorrowerName {
  Name: IName;
  NameType: ICodeRef;
  Source: ISource;

  constructor(_data: IBorrowerName) {
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
