import { ICodeRef } from 'libs/interfaces/common.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';

export class CodeRef extends Homogenize implements ICodeRef {
  abbreviation: string | null = null;
  description: string | null = null;
  symbol: number | string | null = null;
  rank: number | string | null = null;

  constructor(_data: ICodeRef) {
    super(_data);
    this.homogenize(_data);
  }
}
