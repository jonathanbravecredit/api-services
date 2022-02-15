import { AttributeValue } from 'aws-lambda';

export interface IBatchPayload<T> {
  service: string;
  command: string;
  message: T;
}

export interface IAttributeValue {
  [key: string]: AttributeValue;
}
export interface IBatchMsg<T> {
  exclusiveStartKey?: T | undefined;
  lastEvaluatedKey?: T | undefined;
  items?: any;
  segment: number;
  totalSegments: number;
}
