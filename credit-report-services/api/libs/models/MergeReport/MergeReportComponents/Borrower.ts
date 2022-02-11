import {
  IBorrower,
  IBorrowerAddress,
  IBorrowerBirth,
  IBorrowerBureauIdentifier,
  IBorrowerName,
  IBorrowerTelephone,
  ICreditScore,
  ICreditStatement,
  IEmployer,
  ISocialPartition,
} from 'libs/interfaces/merge-report.interface';
import { Homogenize } from 'libs/models/Base/HomogenizeData';
import { BorrowerAddress } from 'libs/models/MergeReport/MergeReportComponents/BorrowerAddress';

export class Borrower extends Homogenize<IBorrower> implements IBorrower {
  BorrowerAddress: IBorrowerAddress[] = [];
  PreviousAddress: IBorrowerAddress[] = [];
  Birth: IBorrowerBirth[] = [];
  CreditStatement: ICreditStatement[] = [];
  CreditScore: ICreditScore[] = [];
  Employer: IEmployer[] = [];
  BorrowerName: IBorrowerName[] = [];
  BorrowerTelephone: IBorrowerTelephone[] = [];
  SocialPartition: ISocialPartition[] = [];
  BorrowerBureauIdentifier: IBorrowerBureauIdentifier[] = [];
  borrowerKey: string | null = null;
  SocialSecurityNumber: string | number | null = null;

  constructor(_data: IBorrower) {
    super(_data);
    this.homogenize(_data);
    this.init();
  }

  init(): void {
    if (!this.BorrowerAddress) {
      this.BorrowerAddress = [];
    } else if (this.BorrowerAddress.length) {
      this.BorrowerAddress = this.BorrowerAddress.map((a) => {
        return new BorrowerAddress(a);
      });
    }
  }
}
