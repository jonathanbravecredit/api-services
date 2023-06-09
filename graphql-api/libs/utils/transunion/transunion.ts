import { IRemark } from '@bravecredit/brave-sdk';
import {
  IBorrowerName,
  ICreditAddress,
  IEmployer,
  IPhoneNumber,
  ITradeLinePartition,
} from '@bravecredit/brave-sdk/dist/types/merge-report';
import { IVantageScore } from 'libs/interfaces/transunion/vantage-score.interface';
import { IFulfillServiceProductResponse } from 'libs/transunion/fulfill/fulfill.interface';
import { CreditScoreTracking } from 'libs/utils/db/credit-score-tracking/model/credit-score-tracking';

// start building this out to handle all the data from TU
export class TransunionUtil {
  static bcMissing: string = '--';
  constructor() {}

  /**
   * Reconstitutes the borrower name into one string
   * @param borrowerName
   * @returns
   */
  static nameUnparser(borrowerName: IBorrowerName | undefined): string {
    if (!borrowerName) return this.bcMissing;
    if (!borrowerName.Name) return this.bcMissing;
    const name: Record<string, any> = borrowerName.Name;
    if (!name) return this.bcMissing;
    let fullName = '';
    // `${(name[key] as string).replace(new RegExp(',', 'g'), ' ')} ` : '';
    for (const key in NAME_MAP) {
      const str = !!name[key] ? name[key] : '';
      fullName = `${fullName}${str}`;
    }
    return fullName.trim();
  }

  /**
   * Reconstitutes the borrower address into one string with line break
   * @param address
   * @returns
   */
  static addressUnparser(address: ICreditAddress | undefined): string {
    if (!address) return this.bcMissing;
    let records: Record<string, any> = address;
    let creditAddress = '';
    for (const key in ADDRESS_LINE_1) {
      const str = !!records[key] ? `${records[key]} ` : '';
      creditAddress = `${creditAddress}${str}`;
    }
    creditAddress = `${creditAddress}\n`;
    for (const key in ADDRESS_LINE_2) {
      const str = !!records[key] ? `${records[key]} ` : '';
      creditAddress = `${creditAddress}${str}`;
    }
    return creditAddress;
  }

  /**
   * Reconstitutes the borrower employers with address into one string with line break
   * @param employer
   * @returns
   */
  static employerUnparser(employer: IEmployer | undefined): string {
    if (!employer) return this.bcMissing;
    if (!employer.name) return this.bcMissing;

    const empAddress = employer.CreditAddress ? `\n${this.addressUnparser(employer.CreditAddress)}` : '';
    let str = `${employer.name}${empAddress}`;
    return str;
  }

  /**
   * Reconstitutes the borrower phone number into one string with area code and extension
   * @param phone
   * @returns
   */
  static phoneUnparser(phone: IPhoneNumber | undefined): string {
    if (!phone) return this.bcMissing;
    let area = phone.AreaCode ? `(${phone.AreaCode}) ` : '';
    let main = phone.Number ? `${phone.Number} ` : '';
    let ext = phone.Extension ? ` Ext: ${phone.Extension} ` : '';
    const digits = `${area}${main}${ext}`;
    if (!digits) return this.bcMissing;
    return digits;
  }

  /**
   * Sorts the tradeline by the account type
   * @param {ITradeLinePartition[]} tradeLines
   * @returns
   */
  static sortTradelineByAccountType(tradeLines: ITradeLinePartition[]): ITradeLinePartition[] {
    return [
      ...tradeLines.sort((a, b) => {
        if (a.accountTypeSymbol?.toLowerCase() === 'y' && b.accountTypeDescription?.toLowerCase() !== 'y') {
          return 1;
        }
        if (a.accountTypeSymbol?.toLowerCase() !== 'y' && b.accountTypeDescription?.toLowerCase() === 'y') {
          return -1;
        }
        return 0;
      }),
    ];
  }

  /**
   * Helper function to securey look up the original creditor
   * @param {ITradeLinePartition | undefined} partition
   * @returns
   */
  static lookupOriginalCreditor(partition: ITradeLinePartition | undefined): string {
    if (!partition) return this.bcMissing;
    const originalCreditor = partition.Tradeline?.CollectionTrade?.originalCreditor;
    const creditorName = partition.Tradeline?.creditorName || this.bcMissing;
    if (partition.accountTypeSymbol?.toLowerCase() === 'y') {
      return originalCreditor ? originalCreditor : creditorName;
    } else {
      return creditorName;
    }
  }

  /**
   * Helper function to securely look up the dispute flag
   * @param {ITradeLinePartition | undefined} partition
   * @returns
   */
  static lookupDisputeFlag(partition: ITradeLinePartition | undefined): string {
    if (!partition) return 'No';
    const symbol = partition.Tradeline?.DisputeFlag?.description || 'not';
    return symbol.indexOf('not') === -1 ? 'Yes' : 'No';
  }

  /**
   * Flatten the remarks into one paragraph
   * @param remarks
   * @returns
   */
  static parseRemarks(remarks: IRemark | IRemark[] | undefined): string {
    if (remarks === undefined) return '';
    return remarks instanceof Array
      ? remarks.map((r) => r.customRemark || '').reduce((a, b) => `${a} \n ${b}`)
      : remarks.customRemark || '';
  }

  /**
   * Flatten the remarks into one paragraph
   * @param remarks
   * @returns
   */
  static parseProductResponseForScoreTracking(
    resp: IFulfillServiceProductResponse | IFulfillServiceProductResponse[],
    score?: CreditScoreTracking,
  ): CreditScoreTracking | null {
    let fulfillVantageScore: IFulfillServiceProductResponse;
    if (resp instanceof Array) {
      fulfillVantageScore = resp.find((item: IFulfillServiceProductResponse) => {
        return item['ServiceProduct'] === 'TUCVantageScore3';
      });
    } else if (resp['ServiceProduct'] === 'TUCVantageScore3') {
      fulfillVantageScore = resp;
    }
    const prodObj = fulfillVantageScore.ServiceProductObject;
    console.log('prodObject in getScore ');
    let vantageScore: IVantageScore;
    if (typeof prodObj === 'string') {
      vantageScore = JSON.parse(prodObj);
    } else if (typeof prodObj === 'object') {
      vantageScore = prodObj;
    }
    // parse the new score
    const {
      CreditScoreType: { riskScore },
    } = vantageScore;
    if (!riskScore) return null;
    // step 2c. move the current score to the prior score field. update the current score with the score from the fulfill results
    const priorScore = score.currentScore;
    // step 2d. note if the delta.
    const delta = priorScore < 300 ? 0 : riskScore - priorScore;
    const newScore: CreditScoreTracking = {
      ...score,
      delta,
      priorScore,
      currentScore: riskScore,
    };
    return newScore;
  }
}

const PHONE_MAP: Record<string, any> = {
  AreaCode: true,
  Number: true,
  Extension: true,
};

const NAME_MAP: Record<string, any> = {
  prefix: true,
  first: true,
  middle: true,
  last: true,
  suffix: true,
};

const ADDRESS_LINE_1: Record<string, any> = {
  houseNumber: true,
  streetNumber: true,
  streetName: true,
  streetType: true,
  direction: true,
  unit: true,
};

const ADDRESS_LINE_2: Record<string, any> = {
  city: true,
  stateCode: true,
  postalCode: true,
};
