export interface APIRequester {
  createRequest: () => void;
  generateRequestObject: () => void;
  generateXMLObject: () => void;
  getReqWrapper: (obj) => any;
  getXMLWrapper: (obj) => any;
  parseRequest: (obj) => any;
  parseXML: (obj) => any;
  convertXML: () => void;
}
