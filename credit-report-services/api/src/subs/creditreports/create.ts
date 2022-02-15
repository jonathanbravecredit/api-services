import 'reflect-metadata';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { IBatchPayload, ICreditReportPayload } from 'libs/interfaces/batch.interfaces';
import { CreditReportMaker } from 'libs/models/CreditReport.model';
import { createReport, updateReport } from 'libs/queries/CreditReport.queries';

export const main: SQSHandler = async (event: SQSEvent): Promise<any> => {
  const reportRequests = event.Records.map((r) => {
    return JSON.parse(r.body) as IBatchPayload<ICreditReportPayload>;
  });

  if (reportRequests.length) {
    try {
      Promise.all(
        reportRequests.map(async (rec) => {
          const message = rec.message;
          const { userId, bureau, report } = message;
          const added = new CreditReportMaker(userId, bureau, report);
          const current = new CreditReportMaker(userId, bureau, report, 0); // version 0 is always current
          current.setCurrentVersion(added.version);
          try {
            await createReport(added);
            await updateReport(current);
          } catch (err) {
            console.log('err: ', err);
          }
        }),
      );
    } catch (err) {
      console.log('err: ', err);
    }
  }
};
