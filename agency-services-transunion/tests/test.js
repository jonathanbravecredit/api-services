const { GetInvestigationResults } = require('../lib/proxy/proxy-handlers');
const https = require('https');

const example = {
  AccountCode: 'M2RVc0ZZM0Rwd2FmZA',
  AccountName: 'CC2BraveCredit',
  RequestKey: '',
  ClientKey: 'a2c7e506-48f6-4573-b1c1-b7cb3ca3c3f3',
  EnrollmentKey: '7afc2104-417c-48c3-8bb5-b46267fcbfc6',
  DisputeId: '4606',
};

const msg = { disputeId: '4606' };
const agent = new https.Agent();
const auth = 'Basic blah blah';

GetInvestigationResults(example.AccountCode, example.AccountName, JSON.stringify(msg), agent, auth, example.ClientKey);
