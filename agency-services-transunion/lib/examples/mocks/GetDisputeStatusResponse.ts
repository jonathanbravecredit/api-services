import { MOCK_CONFIG } from 'lib/examples/mocks/Config';

export const GET_DISPUTE_STATUS_RESPONSE = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body>
  <GetDisputeStatusResponse xmlns="https://consumerconnectws.tui.transunion.com/">
    <GetDisputeStatusResult xmlns:a="https://consumerconnectws.tui.transunion.com/data"
      xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
      <a:AccountName>CCSIntegration</a:AccountName>
      <a:ErrorResponse i:nil="true"/>
      <a:RequestKey>816e1fc1-0096-4c2b-8fd7-013daea4fc07</a:RequestKey>
      <a:ResponseType>Success</a:ResponseType>
      <a:ClientKey>${MOCK_CONFIG.userId}</a:ClientKey>
      <a:DisputeStatus/>
    </GetDisputeStatusResult>
  </GetDisputeStatusResponse>
</s:Body>
</s:Envelope>`;
