import { ISource } from 'lib/interfaces/common.interface';
import { ISocial } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { Source } from 'lib/models/Common/Source';

export class Social extends Homogenize<Partial<ISocial>> implements ISocial {
  SocialSecurityNumber: string | null = null;
  Source: ISource;

  constructor(_data: Partial<ISocial>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Source = new Source(this.Source);
  }
}
