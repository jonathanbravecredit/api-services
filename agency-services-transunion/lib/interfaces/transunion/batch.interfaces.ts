export interface IBatchPayload<T> {
  service: string;
  command: string;
  message: T;
}

export interface IBatchMsg<T> {
  exclusiveStartKey?: T | undefined;
  lastEvaluatedKey?: T | undefined;
  items?: any;
  segment: number;
  totalSegments: number;
}
