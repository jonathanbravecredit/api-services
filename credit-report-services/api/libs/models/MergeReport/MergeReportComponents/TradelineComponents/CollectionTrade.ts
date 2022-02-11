import { ICodeRef } from 'libs/interfaces/common.interface';
import { ICollectionTrade } from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { CodeRef } from 'libs/models/Common/CodeRef';

export class CollectionTrade extends Homogenize<ICollectionTrade> implements ICollectionTrade {
  creditType: ICodeRef; // TODO double check the case in XSD
  actualPaymentAmount: number | string | null = null;
  originalCreditor: string | null = null;

  constructor(_data: ICollectionTrade) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.creditType = new CodeRef(this.creditType);
  }
}
