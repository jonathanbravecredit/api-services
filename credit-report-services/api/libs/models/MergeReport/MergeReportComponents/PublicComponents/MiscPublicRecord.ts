import { IMiscPublicRecord } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';

export class MiscPublicRecord extends Homogenize<IMiscPublicRecord> implements IMiscPublicRecord {
  miscInformation: string;

  constructor(_data: IMiscPublicRecord) {
    super(_data);
    this.homogenize(_data);
  }
}
