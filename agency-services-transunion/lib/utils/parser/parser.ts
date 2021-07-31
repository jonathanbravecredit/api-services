import * as fastXml from 'fast-xml-parser';

export class Parser {
  parser: (xml: string, options: any) => any;
  constructor(parser: (xml: string, options: any) => any) {
    this.parser = parser;
  }

  parse(
    xmlData: string,
    options?: Partial<fastXml.X2jOptions>,
    validationOptions?: boolean | Partial<fastXml.validationOptions>,
  ) {
    return this.parser(xmlData, options);
  }
}
