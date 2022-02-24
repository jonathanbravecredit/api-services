import { ICodeRef } from 'lib/interfaces/common.interface';
import { ICollectionTrade } from 'lib/interfaces/merge-report.interface';
import { Homogenize } from 'lib/models/Base/HomogenizeData';
import { CodeRef } from 'lib/models/Common/CodeRef';

export class CollectionTrade extends Homogenize<Partial<ICollectionTrade>> implements ICollectionTrade {
  creditType: ICodeRef; // TODO double check the case in XSD
  actualPaymentAmount: number | string | null = null;
  originalCreditor: string | null = null;

  constructor(_data: Partial<ICollectionTrade>) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    this.creditType = new CodeRef(this.creditType);
  }
}
