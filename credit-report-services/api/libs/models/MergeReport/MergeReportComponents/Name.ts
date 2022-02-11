import { IName } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';

export class Name extends Homogenize<IName> implements IName {
  prefix: string = null;
  first: string = null;
  middle: string = null;
  last: string = null;
  suffix: string = null;

  constructor(_data: IName) {
    super(_data);
    this.homogenize(_data);
  }
}
