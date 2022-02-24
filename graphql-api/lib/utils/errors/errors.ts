import { TU_ERROR_CODES } from 'lib/data/constants';
import { IErrorCode, IErrorResult } from 'lib/interfaces';

// const sampleResp = {
//   Enroll:
//     '{"EnrollResult":{"AccountName":"CC2BraveCredit","ErrorResponse":{"Code":103045,"Message":"An active enrollment already exists for the service bundle code and client key","Name":"EnrollAlreadyHasActiveEnrollment"},"RequestKey":"BC-1a8451a2-4c1e-4037-b50c-67284d5736f2","ResponseType":"Failure","ClientKey":"198e38e5-7d7d-4692-954a-720b0debf6bd","EnrollmentKey":"","ServiceBundleFulfillmentKey":"","ServiceProductFulfillments":{"nil":true}}}',
// };

// const parsed = {
//   "EnrollResult": {
//       "AccountName": "CC2BraveCredit",
//       "ErrorResponse": {
//           "Code": 103045,
//           "Message": "An active enrollment already exists for the service bundle code and client key",
//           "Name": "EnrollAlreadyHasActiveEnrollment"
//       },
//       "RequestKey": "BC-1a8451a2-4c1e-4037-b50c-67284d5736f2",
//       "ResponseType": "Failure",
//       "ClientKey": "198e38e5-7d7d-4692-954a-720b0debf6bd",
//       "EnrollmentKey": "",
//       "ServiceBundleFulfillmentKey": "",
//       "ServiceProductFulfillments": {
//           "nil": true
//       }
//   }
// }

export const errorHandler = (method: string, results: IErrorResult): IErrorCode | null => {
  if (!Object.keys(results.ErrorResponse).length) return null;
  const resp = results.ErrorResponse;
  const { Code, Message, Name } = resp;
  if (!Code) return null;
  const error: IErrorCode = TU_ERROR_CODES[`${Code}`];
  return error;
};
