import * as fastXml from 'fast-xml-parser';
import * as he from 'he';

export class ServiceProductParser {
  static parseResponse(prod: any, options: any) {
    let prodObj = prod['ServiceProductObject']['#text'];
    if (typeof prodObj === 'string') {
      let clean = he.decode(he.decode(prodObj)); // two decodes, because comes in encoded, and our defualt parser options encode it again.
      const parsed = fastXml.parse(clean, options);
      console.log('parsed ===> ', parsed);
      return {
        ...prod,
        ServiceProductObject: parsed,
      };
    } else {
      return prod;
    }
  }
}
