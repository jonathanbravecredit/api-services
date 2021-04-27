/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
export const hasJsonStructure = (str: string): boolean => {
  if (typeof str !== 'string') return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]' || type === '[object Array]';
  } catch (err) {
    return false;
  }
};

export const safeParse = (data: any, eventKey: string): any => {
  if (Object.prototype.hasOwnProperty.call(data, eventKey)) {
    if (hasJsonStructure(data[eventKey])) {
      return JSON.parse(data[eventKey]);
    }
    return data[eventKey];
  }
  if (hasJsonStructure(data)) {
    return JSON.parse(data);
  }
  return data;
};
