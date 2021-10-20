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
                    <a:DisputeId>4607</a:DisputeId>
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

const errpr = {
  data: {
    transunion: {
      StartDispute: {
        StartDisputeResult: {
          AccountName: 'CC2BraveCredit',
          ErrorResponse: {
            Code: 103059,
            Message: 'Unable to find the required service product information for specified key',
            Name: 'LookupKeyNotFound',
          },
          RequestKey: 'BC-2961dd5c-bca3-4460-b06c-71d4734affe3',
          ResponseType: 'Failure',
          ClientKey: 'fc02d26c-516e-453a-b18b-729000d1be39',
          DisputeStatus: { nil: true },
        },
      },
    },
  },
};

const gql = {
  data: {
    getAppData: {
      id: 'us-east-2:fc02d26c-516e-453a-b18b-729000d1be39',
      user: {
        userAttributes: {
          name: {
            first: 'DANIEL',
            middle: 'J',
            last: 'ILES',
          },
          address: {
            addressOne: '105 2ND AV',
            addressTwo: null,
            city: 'NEWTON',
            state: 'IA',
            zip: '50208',
          },
          dob: {
            year: '1971',
            month: 'Feb',
            day: '1',
          },
          ssn: {
            lastfour: '6661',
            full: '666130041',
          },
        },
      },
      agencies: {
        transunion: {
          disputeEnrollmentKey: 'db73073c-86ac-46ab-a31c-47855d237e28',
          disputeServiceBundleFulfillmentKey: '8426ca08-b076-4bfc-89f2-bf3f855e1619',
          serviceBundleFulfillmentKey: '1a0d174a-2f5a-4e86-9406-3e2cb4d52453',
        },
      },
    },
  },
};
