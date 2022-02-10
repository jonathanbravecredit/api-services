export const response = (statusCode: number, body: any) => {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
};
export const success = (body: any) => {
  return response(200, body);
};
export const failure = (body: any) => {
  return response(500, body);
};
