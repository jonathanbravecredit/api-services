export interface PostAPIBody {
  email: string;
}

export interface IRequestOptions {
  url: string;
  method: string;
  body: string;
  headers: {
    'Accept-Encoding': string;
    'Content-Type': string;
    SOAPAction: string;
    Authorization: string;
    'Content-Length': number;
    Host: string;
    Connection: string;
    'User-Agent': string;
  };
  key: Buffer;
  cert: Buffer;
  passphrase: any;
}
