export class XmlFormatter {
  constructor() {}

  static nilConstructor() {
    return {
      _attributes: {
        'xsi:nil': 'true',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      },
    };
  }

  static textConstructor(text: string, nullable: boolean = false) {
    if (!text && nullable) {
      return this.nilConstructor();
    } else {
      return {
        _text: text || '',
      };
    }
  }

  static cdataConstructor(text: string, nullable: boolean = false) {
    if (!text && nullable) {
      return this.nilConstructor();
    } else {
      return {
        _text: `<![CDATA[${text}]]>`,
      };
    }
  }
}
