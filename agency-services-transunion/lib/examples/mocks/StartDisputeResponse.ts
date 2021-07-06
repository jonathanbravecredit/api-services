export const START_DISPUTE_RESPONSE = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body>
    <StartDisputeResponse xmlns="https://consumerconnectws.tui.transunion.com/">
        <StartDisputeResult xmlns:a="https://consumerconnectws.tui.transunion.com/data"
            xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
            <a:AccountName>CCSIntegration</a:AccountName>
            <a:ErrorResponse i:nil="true"/>
            <a:RequestKey>f8958f94-4842-4142-a9a7-ff05523ec414</a:RequestKey>
            <a:ResponseType>Success</a:ResponseType>
            <a:ClientKey>SR_2018-03-09_13-33-18_DORA</a:ClientKey>
            <a:DisputeStatus>
                <a:DisputeStatusDetail>
                    <a:DisputeId>4606</a:DisputeId>
                    <a:LetterStatus>
                        <a:DisputeLetterCode>FIN 000300010987 - Dispute Status DORA G
                            JULIEN</a:DisputeLetterCode>
                        <a:DisputeLetterContent>Thank you for contacting TransUnion. Our goal is
                            to maintain complete and accurate information on consumer credit
                            reports. Re: Dispute Status We received your request on 03/09/2018
                            and are currently processing it. When the investigation is
                            completed, you will receive a response and/or a copy of your updated
                            credit report to notify you of the results. If you have any
                            additional questions or concerns, please contact TransUnion at the
                            address shown below, or visit us on the web at the following web
                            site to check the status of your dispute. We update the status page
                            once each business day. When contacting our office, please provide
                            your current file number 300010987. Web Site:
                            https://dispute.transunion.com?src=email TransUnion Consumer
                            Relations P.O. Box 2000 Chester, PA 19022-2000 Please do not reply
                            to this email as this is a system generated
                            email.</a:DisputeLetterContent>
                    </a:LetterStatus>
                    <a:OpenDisputes>
                        <a:EstimatedCompletionDate>4/8/2018</a:EstimatedCompletionDate>
                        <a:LastUpdatedDate>3/9/2018</a:LastUpdatedDate>
                        <a:OpenDate>3/9/2018</a:OpenDate>
                        <a:RequestedDate>3/9/2018</a:RequestedDate>
                        <a:TotalClosedDisputedItems>1</a:TotalClosedDisputedItems>
                        <a:TotalDisputedItems>2</a:TotalDisputedItems>
                        <a:TotalOpenDisputedItems>1</a:TotalOpenDisputedItems>
                    </a:OpenDisputes>
                    <a:Status>openDispute</a:Status>
                </a:DisputeStatusDetail>
            </a:DisputeStatus>
        </StartDisputeResult>
    </StartDisputeResponse>
</s:Body>
</s:Envelope>`;
