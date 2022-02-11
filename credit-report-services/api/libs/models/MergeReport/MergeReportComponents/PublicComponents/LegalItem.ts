import { ICodeRef } from 'libs/interfaces/common.interface';
import { ILegalItem } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';

export class LegalItem extends Homogenize<ILegalItem> implements ILegalItem {
  CourtLocation: ICodeRef;
  CourtType: ICodeRef;
  plaintiff: string | null = null;
  lawyer: string | null = null;
  thirdParty: string | null = null;
  actionAmount: number | string | null = null;
  balance: number | string | null = null;
  dateSatisfied: string | null = null;

  constructor(_data: ILegalItem) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.CourtLocation = new CodeRef(this.CourtLocation);
    this.CourtType = new CodeRef(this.CourtType);
  }
}
