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
    this._deleteKeyNestedObject(obj, k);
    return obj;
  }

  private static _deleteKeyNestedObject(o: any, k: string) {
    if (!o) return;
    delete o[k];
    Object.keys(o).forEach((key) => {
      if (typeof o[key] === 'object') {
        this._deleteKeyNestedObject(o[key], k);
      }
    });
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
    this._updateNestedRecurse(obj, k, v);
    return obj;
  }

  private static _updateNestedRecurse(o: any, k: string, v: any) {
    if (!o) return;
    Object.keys(o).forEach((key) => {
      if (key == k) o[k] = v;
      if (typeof o[key] === 'object') {
        this._updateNestedRecurse(o[key], k, v);
      }
    });
  }

  static flatten(obj: any, prefix = '', res = {}) {
    return Object.entries(obj).reduce((r, [key, val]) => {
      const k = `${prefix}${key}`;
      if (typeof val === 'object') {
        Nested.flatten(val, `${k}.`, r);
      } else {
        res[k] = val;
      }
      return r;
    }, res);
  }

  static unflatten(data: any) {
    var result: any = {};
    for (var i in data) {
      var keys = i.split('.');
      keys.reduce(function (r, e, j) {
        return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? data[i] : {}) : []);
      }, result);
    }
    return result;
  }
}
