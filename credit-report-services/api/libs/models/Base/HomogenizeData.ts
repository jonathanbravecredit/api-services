interface InstanceInterface<T> {
  new (_data: any): T;
}

export class Homogenize<T> {
  constructor(_data: T) {
    this.homogenize(_data);
  }

  homogenize(_data: T) {
    Object.assign(this, _data);
  }

  homogenizeArray<I, C>(arr: I | I[], instance: InstanceInterface<C>): C[] {
    if (!arr) {
      return [];
    } else if (!(arr instanceof Array)) {
      return [new instance(arr)];
    } else if (arr instanceof Array) {
      return arr.map((a) => {
        return new instance(a);
      });
    }
  }
}
