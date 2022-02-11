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
import { BorrowerBirth } from 'libs/models/MergeReport/MergeReportComponents/BorrowerBirth';
import { BorrowerBureauIdentifier } from 'libs/models/MergeReport/MergeReportComponents/BorrowerBureauIdentifier';
import { BorrowerName } from 'libs/models/MergeReport/MergeReportComponents/BorrowerName';
import { BorrowerTelephone } from 'libs/models/MergeReport/MergeReportComponents/BorrowerTelephone';
import { CreditScore } from 'libs/models/MergeReport/MergeReportComponents/CreditScore';
import { CreditStatement } from 'libs/models/MergeReport/MergeReportComponents/CreditStatement';
import { Employer } from 'libs/models/MergeReport/MergeReportComponents/Employer';
import { SocialPartition } from 'libs/models/MergeReport/MergeReportComponents/SocialPartition';

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
    this.BorrowerAddress = this.homogenizeArray<IBorrowerAddress, BorrowerAddress>(
      this.BorrowerAddress,
      BorrowerAddress,
    );
    this.PreviousAddress = this.homogenizeArray<IBorrowerAddress, BorrowerAddress>(
      this.PreviousAddress,
      BorrowerAddress,
    );
    this.Birth = this.homogenizeArray<IBorrowerBirth, BorrowerBirth>(this.Birth, BorrowerBirth);
    this.CreditStatement = this.homogenizeArray<ICreditStatement, CreditStatement>(
      this.CreditStatement,
      CreditStatement,
    );
    this.CreditScore = this.homogenizeArray<ICreditScore, CreditScore>(this.CreditScore, CreditScore);
    this.Employer = this.homogenizeArray<IEmployer, Employer>(this.Employer, Employer);
    this.BorrowerName = this.homogenizeArray<IBorrowerName, BorrowerName>(this.BorrowerName, BorrowerName);
    this.BorrowerTelephone = this.homogenizeArray<IBorrowerTelephone, BorrowerTelephone>(
      this.BorrowerTelephone,
      BorrowerTelephone,
    );
    this.SocialPartition = this.homogenizeArray<ISocialPartition, SocialPartition>(
      this.SocialPartition,
      SocialPartition,
    );
    this.BorrowerBureauIdentifier = this.homogenizeArray<IBorrowerBureauIdentifier, BorrowerBureauIdentifier>(
      this.BorrowerBureauIdentifier,
      BorrowerBureauIdentifier,
    );
  }
}
