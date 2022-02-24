import { IName } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';

export class Name extends Homogenize<Partial<IName>> implements IName {
  prefix: string = null;
  first: string = null;
  middle: string = null;
  last: string = null;
  suffix: string = null;

  constructor(_data: Partial<IName>) {
    super(_data);
    this.homogenize(_data);
  }
}
