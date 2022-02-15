import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { response } from 'libs/utils/response';
import * as json from 'libs/data/example.json';
import { MergeReport } from 'libs/models/MergeReport/MergeReport';
import { IMergeReport } from 'libs/interfaces/merge-report.interface';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const tuRaw = json as unknown as IMergeReport;
  const report = new MergeReport(tuRaw);
  console.log('report 1: ', JSON.stringify(report));
  console.log('spacer==========================>');
  console.log('report 2: ', report);
  return response(200, null);
};
