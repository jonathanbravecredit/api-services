import { MOCK_CONFIG } from 'lib/examples/mocks/Config';

export const GET_DISPUTE_HISTORY_RESPONSE = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body>
  <GetDisputeHistoryResponse xmlns="https://consumerconnectws.tui.transunion.com/">
    <GetDisputeHistoryResult xmlns:a="https://consumerconnectws.tui.transunion.com/data"
      xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
      <a:AccountName>CCSIntegration</a:AccountName>
      <a:ErrorResponse i:nil="true"/>
      <a:RequestKey>a8ae0233-a3b1-4873-8cc1-f1bc9c4c0315</a:RequestKey>
      <a:ResponseType>Success</a:ResponseType>
      <a:ClientKey>${MOCK_CONFIG.userId}</a:ClientKey>
      <a:Disputes i:nil="true"/>
    </GetDisputeHistoryResult>
  </GetDisputeHistoryResponse>
</s:Body>
</s:Envelope>`;
