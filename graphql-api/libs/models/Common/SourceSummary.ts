import { ISource, ISourceSummary } from 'libs/interfaces/common.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { Source } from 'libs/models/Common/Source';

export class SourceSummary extends Homogenize<Partial<ISourceSummary>> implements ISourceSummary {
  Source: ISource;

  constructor(_data: Partial<ISourceSummary>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init() {
    this.Source = new Source(this.Source);
  }
}
