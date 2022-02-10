export const hasJsonStructure = (str: string) => {
  if (typeof str !== 'string') return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]' || type === '[object Array]';
  } catch (err) {
    return false;
  }
};

export const safeParse = (data: string | Record<string, any>, eventKey: string | number) => {
  if (typeof data !== 'string' && data.hasOwnProperty(eventKey.toString())) {
    if (hasJsonStructure(data[eventKey])) {
      return JSON.parse(data[eventKey]);
    } else {
      return data[eventKey];
    }
  } else if (typeof data === 'string') {
    if (hasJsonStructure(data)) {
      return JSON.parse(data);
    } else {
      return data;
    }
  }
};
