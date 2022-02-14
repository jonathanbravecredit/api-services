import { ISource } from 'libs/interfaces/common.interface';
import { IBorrowerBureauIdentifier } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { Source } from 'libs/models/Common/Source';

export class BorrowerBureauIdentifier
  extends Homogenize<Partial<IBorrowerBureauIdentifier>>
  implements IBorrowerBureauIdentifier
{
  type: string | null = null;
  identifier: string | null = null;
  partitionSet: number | string | null = null;
  Source: ISource;

  constructor(_data: Partial<IBorrowerBureauIdentifier>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.Source = new Source(this.Source);
  }
}
