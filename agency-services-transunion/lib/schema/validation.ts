import Ajv from 'ajv';
import * as schemaGetAppDataRequest from './schema_get-app-data-request.json';
import * as schemaStartDisputeRequest from './schema_start-dispute-request.json';
export const ajv = new Ajv();
ajv.addSchema(schemaGetAppDataRequest, 'getAppDataRequest');
ajv.addSchema(schemaStartDisputeRequest, 'startDisputeRequest');
