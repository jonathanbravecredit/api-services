export class Helper<T> {
  constructor(private object: T) {}

  hasProperty(object: T, prop: string): boolean {
    return Object.keys(object).filter((key) => key === prop).length > 0;
  }

  hasMethod(object: { [key: string]: any }, method: string): boolean {
    return typeof object[method] == 'function';
  }
}
