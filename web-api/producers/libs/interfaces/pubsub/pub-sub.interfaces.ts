export interface IBatchPayload<T> {
  service: string;
  command: string;
  message: T;
}
