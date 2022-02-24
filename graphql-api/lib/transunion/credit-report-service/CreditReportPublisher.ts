import { SNS } from 'aws-sdk';
import { ICreditReportPayload } from 'lib/interfaces/batch.interfaces';
import { PubSubUtil } from 'lib/utils/pubsub/pubsub';
import { BraveParsers } from 'lib/utils/brave/parser/BraveParser';
import { IMergeReport } from 'lib/interfaces/merge-report.interface';

export class CreditReportPublisher {
  constructor(private spo: string) {}

  /**
   * Publishes the TU merge report in it's raw form to the Credit Report service
   * - credit report service handles homogenizing the reports
   * @param id
   */
  async publish(id: string): Promise<void> {
    const report = BraveParsers.parseTransunionMergeReport(this.spo) as unknown as IMergeReport; // make sure the right merge report
    const pubsub = new PubSubUtil();
    const topic = process.env.CREDITREPORTS_SNS_PROXY_ARN;
    const payload = {
      userId: id,
      bureau: 'transunion',
      report: report,
    } as ICreditReportPayload;
    const snsPayload = pubsub.createSNSPayload<ICreditReportPayload>('create', payload, 'creditreports', topic);
    const sns = new SNS({ region: 'us-east-2' });
    await sns.publish(snsPayload).promise();
  }
}
