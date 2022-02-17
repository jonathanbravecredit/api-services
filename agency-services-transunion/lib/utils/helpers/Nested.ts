export class Nested {
  /**
   * A utility function to find the first (non-undefined) matching key in a nested object
   *   use carefully. Does not iterate over arrays
   * @param {object} o the object you want to search
   * @param {string} k the key you want to search for
   */
  static find<T>(o: any, k: string): T {
    let value;
    const _returnNestedObject = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (key === k && value === undefined) value = obj[k];
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          _returnNestedObject(obj[key]);
        }
      });
    };
    _returnNestedObject(o);
    return value;
  }

  /**
   * A utility function to find all (non-undefined) matching key in a nested object
   *   use carefully. Does not iterate over arrays
   * @param {object} o the object you want to search
   * @param {string} k the key you want to search for
   */
  static findAll<T>(o: any, k: string): T[] {
    let value = [];
    const _returnNestedObject = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (key === k) value.push(obj[k]);
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          _returnNestedObject(obj[key]);
        }
      });
    };
    _returnNestedObject(o);
    return value;
  }

  /**
   * A utility function to remove unwanted fields by key
   * Will delete all keys of the name you specify
   * @param o
   * @param k
   * @returns
   */
  static delete(o: any, k: string) {
    const obj = Object.assign({}, o);
    const _deleteKeyNestedObject = (o: any, k: string) => {
      if (!o) return;
      delete o[k];
      Object.keys(o).forEach((key) => {
        if (typeof o[key] === 'object') {
          _deleteKeyNestedObject(o[key], k);
        }
      });
    };
    return obj;
  }

  /**
   * A utility function to update deep nested objects
   * Will update all keys of the name you specify
   * @param {object} o the object you want to transform
   * @param {string} k the key you want to update (updates all of same name)
   * @param {any} v the value you want to update it to
   */
  static update(o: any, k: string, v: any): any {
    const obj = Object.assign({}, o);
    const _updateNestedRecurse = (o: any, k: string, v: any) => {
      if (!o) return;
      Object.keys(o).forEach((key) => {
        if (key == k) o[k] = v;
        if (typeof o[key] === 'object') {
          _updateNestedRecurse(o[key], k, v);
        }
      });
    };
    return obj;
  }
}
