import { ISB168Frozen } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';

export class SB168Frozen extends Homogenize<Partial<ISB168Frozen>> implements ISB168Frozen {
  equifax: boolean | null = null;
  experian: boolean | null = null;
  transunion: boolean | null = null;

  constructor(_data: Partial<ISB168Frozen>) {
    super(_data);
    this.homogenize(_data);
  }
}
