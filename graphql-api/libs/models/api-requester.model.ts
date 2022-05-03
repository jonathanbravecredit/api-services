export interface APIRequester {
  generateRequest: () => void;
  addRequestDefaults: () => void;
  generateXMLObject: () => void;
  addXMLDefaults: () => void;
  convertXML: () => void;
}
