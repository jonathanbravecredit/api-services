import { MOCK_CONFIG } from 'libs/examples/mocks/Config';

export const GET_DISPUTE_STATUS_RESPONSE_WITHID = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body>
  <GetDisputeStatusResponse xmlns="https://consumerconnectws.tui.transunion.com/">
    <GetDisputeStatusResult xmlns:a="https://consumerconnectws.tui.transunion.com/data"
      xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
      <a:AccountName>CCSIntegration</a:AccountName>
      <a:ErrorResponse i:nil="true"/>
      <a:RequestKey>816e1fc1-0096-4c2b-8fd7-013daea4fc07</a:RequestKey>
      <a:ResponseType>Success</a:ResponseType>
      <a:ClientKey>${MOCK_CONFIG.userId}</a:ClientKey>
      <a:DisputeStatus>
          <a:DisputeStatusDetail>
            <a:DisputeId>${MOCK_CONFIG.disputeId}</a:DisputeId>
            <a:OpenDisputes>
              <a:EstimatedCompletionDate>4/8/2018</a:EstimatedCompletionDate>
              <a:LastUpdatedDate>3/9/2018</a:LastUpdatedDate>
              <a:OpenDate>3/9/2018</a:OpenDate>
              <a:RequestedDate>3/9/2018</a:RequestedDate>
              <a:TotalClosedDisputedItems>2</a:TotalClosedDisputedItems>
              <a:TotalDisputedItems>2</a:TotalDisputedItems>
              <a:TotalOpenDisputedItems>0</a:TotalOpenDisputedItems>
            </a:OpenDisputes>
            <a:Status>completeDispute</a:Status>
          </a:DisputeStatusDetail>
        </a:DisputeStatus>
    </GetDisputeStatusResult>
  </GetDisputeStatusResponse>
</s:Body>
</s:Envelope>`;
