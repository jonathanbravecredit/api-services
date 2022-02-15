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
import { BorrowerAddress } from 'libs/models/MergeReport/MergeReportComponents/BorrowerComponents/BorrowerAddress';
import { BorrowerBirth } from 'libs/models/MergeReport/MergeReportComponents/BorrowerComponents/BorrowerBirth';
import { BorrowerBureauIdentifier } from 'libs/models/MergeReport/MergeReportComponents/BorrowerComponents/BorrowerBureauIdentifier';
import { BorrowerName } from 'libs/models/MergeReport/MergeReportComponents/BorrowerComponents/BorrowerName';
import { BorrowerTelephone } from 'libs/models/MergeReport/MergeReportComponents/BorrowerComponents/BorrowerTelephone';
import { CreditScore } from 'libs/models/MergeReport/MergeReportComponents/BorrowerComponents/CreditScore';
import { CreditStatement } from 'libs/models/MergeReport/MergeReportComponents/BorrowerComponents/CreditStatement';
import { Employer } from 'libs/models/MergeReport/MergeReportComponents/BorrowerComponents/Employer';
import { SocialPartition } from 'libs/models/MergeReport/MergeReportComponents/BorrowerComponents/SocialPartition';

export class Borrower extends Homogenize<Partial<IBorrower>> implements IBorrower {
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

  constructor(_data: Partial<IBorrower>) {
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
