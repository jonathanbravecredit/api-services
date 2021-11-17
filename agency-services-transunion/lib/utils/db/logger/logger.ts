import { PutItemOutput } from 'aws-sdk/clients/dynamodb';

export interface ILogger<T> {
  get(arg0: string, arg1: string): Promise<T>;
  list(arg0: string): Promise<T[]>;
  create(arg0: T): Promise<PutItemOutput>;
}

export default class Logger<T> implements ILogger<T> {
  get(arg0: string, arg1: string): Promise<T> {
    throw new Error('Method not implemented.');
  }
  list(arg0: string): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  create(arg0: T): Promise<PutItemOutput> {
    throw new Error('Method not implemented.');
  }

  constructor(
    get: (arg0: string, arg1: string) => Promise<T>,
    list: (arg0: string) => Promise<T[]>,
    create: (arg0: T) => Promise<PutItemOutput>,
  ) {
    this.get = get;
    this.list = list;
    this.create = create;
  }
}
