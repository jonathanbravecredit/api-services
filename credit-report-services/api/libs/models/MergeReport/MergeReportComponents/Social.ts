import { ISource } from 'libs/interfaces/common.interface';
import { ISocial } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { Source } from 'libs/models/Common/Source';

export class Social extends Homogenize<ISocial> implements ISocial {
  SocialSecurityNumber: string | null = null;
  Source: ISource;

  constructor(_data: ISocial) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Source = new Source(this.Source);
  }
}
