export const GET_INVESTIGATION_RESULTS_COLLECTIONS = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body>
  <GetInvestigationResultsResponse xmlns="https://consumerconnectws.tui.transunion.com/">
    <GetInvestigationResultsResult xmlns:a="https://consumerconnectws.tui.transunion.com/data" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
      <a:AccountName>CCSIntegration</a:AccountName>
      <a:ErrorResponse i:nil="true" />
      <a:RequestKey>f214bb46-e1db-47a0-9e12-8aa90e5a922b</a:RequestKey>
      <a:ResponseType>Success</a:ResponseType>
      <a:ClientKey>VR_2019-04-30_16-10-34_MOSES</a:ClientKey>
      <a:CreditBureau>&lt;ns0:fileSummary&gt;
      &lt;ns0:inFileSinceDate&gt;01/01/1990&lt;/ns0:inFileSinceDate&gt;
      &lt;ns0:disclosureCoverInfo&gt;
         &lt;ns0:coverCode&gt;15&lt;/ns0:coverCode&gt;
         &lt;ns0:versionNo&gt;1&lt;/ns0:versionNo&gt;
         &lt;ns0:disputeURL&gt;www.transunion.com/disputeonline&lt;/ns0:disputeURL&gt;
         &lt;ns0:summarySection&gt;
            &lt;ns0:lineItem&gt;
               &lt;ns0:itemKey&gt;1X5X5X8X_758M020_O&lt;/ns0:itemKey&gt;
               &lt;ns0:handle&gt;&lt;/ns0:handle&gt;
               &lt;ns0:itemType&gt;13&lt;/ns0:itemType&gt;
               &lt;ns0:credit&gt;
                  &lt;ns0:item&gt;
                     &lt;ns0:subscriber&gt;
                        &lt;ns0:name&gt;
                           &lt;ns0:unparsed&gt;ALLIED INTERSTATE INC&lt;/ns0:unparsed&gt;
                        &lt;/ns0:name&gt;
                        &lt;ns0:address&gt;
                           &lt;ns0:street&gt;
                              &lt;ns0:unparsed&gt;3000 CORPORATE ROA&lt;/ns0:unparsed&gt;
                           &lt;/ns0:street&gt;
                           &lt;ns0:location&gt;
                              &lt;ns0:unparsed&gt;COLUMBUS, OH 43231&lt;/ns0:unparsed&gt;
                              &lt;ns0:city&gt;COLUMBUS&lt;/ns0:city&gt;
                              &lt;ns0:state&gt;OH&lt;/ns0:state&gt;
                              &lt;ns0:zipCode&gt;43231&lt;/ns0:zipCode&gt;
                           &lt;/ns0:location&gt;
                        &lt;/ns0:address&gt;
                        &lt;ns0:phone&gt;
                           &lt;ns0:unparsed&gt;(877) 350-9743&lt;/ns0:unparsed&gt;
                           &lt;ns0:areaCode&gt;877&lt;/ns0:areaCode&gt;
                           &lt;ns0:exchange&gt;350&lt;/ns0:exchange&gt;
                           &lt;ns0:suffix&gt;9743&lt;/ns0:suffix&gt;
                        &lt;/ns0:phone&gt;
                     &lt;/ns0:subscriber&gt;
                  &lt;/ns0:item&gt;
                  &lt;ns0:description&gt;
                     &lt;ns0:descriptionText&gt;# 1X5X5X8X&lt;/ns0:descriptionText&gt;
                  &lt;/ns0:description&gt;
                  &lt;ns0:result&gt;VERIFIED AS ACCURATE&lt;/ns0:result&gt;
               &lt;/ns0:credit&gt;
            &lt;/ns0:lineItem&gt;
         &lt;/ns0:summarySection&gt;
         &lt;ns0:resellerOperatorId&gt; &lt;/ns0:resellerOperatorId&gt;
      &lt;/ns0:disclosureCoverInfo&gt;
   &lt;/ns0:fileSummary&gt;
&lt;ns0:trade&gt;
            &lt;ns0:itemKey&gt;1X5X5X8X_758M020_O&lt;/ns0:itemKey&gt;
            &lt;ns0:subscriber&gt;
               &lt;ns0:industryCode&gt;YC&lt;/ns0:industryCode&gt;
               &lt;ns0:memberCode&gt;758M020&lt;/ns0:memberCode&gt;
               &lt;ns0:name&gt;
                  &lt;ns0:unparsed&gt;ALLIED INTERSTATE INC&lt;/ns0:unparsed&gt;
               &lt;/ns0:name&gt;
               &lt;ns0:address&gt;
                  &lt;ns0:street&gt;
                     &lt;ns0:unparsed&gt;3000 CORPORATE ROA&lt;/ns0:unparsed&gt;
                  &lt;/ns0:street&gt;
                  &lt;ns0:location&gt;
                     &lt;ns0:unparsed&gt;COLUMBUS, OH 43231&lt;/ns0:unparsed&gt;
                     &lt;ns0:city&gt;COLUMBUS&lt;/ns0:city&gt;
                     &lt;ns0:state&gt;OH&lt;/ns0:state&gt;
                     &lt;ns0:zipCode&gt;43231&lt;/ns0:zipCode&gt;
                  &lt;/ns0:location&gt;
               &lt;/ns0:address&gt;
               &lt;ns0:phone&gt;
                  &lt;ns0:number&gt;
                     &lt;ns0:unparsed&gt;(877) 350-9743&lt;/ns0:unparsed&gt;
                     &lt;ns0:areaCode&gt;877&lt;/ns0:areaCode&gt;
                     &lt;ns0:exchange&gt;350&lt;/ns0:exchange&gt;
                     &lt;ns0:suffix&gt;9743&lt;/ns0:suffix&gt;
                  &lt;/ns0:number&gt;
               &lt;/ns0:phone&gt;
            &lt;/ns0:subscriber&gt;
            &lt;ns0:portfolioType&gt;open&lt;/ns0:portfolioType&gt;
            &lt;ns0:accountNumber&gt;1X5X5X8X&lt;/ns0:accountNumber&gt;
            &lt;ns0:ECOADesignator&gt;individual&lt;/ns0:ECOADesignator&gt;
            &lt;ns0:dateOpened&gt;11/30/2018&lt;/ns0:dateOpened&gt;
            &lt;ns0:dateEffectiveLabel&gt;DateUpdated&lt;/ns0:dateEffectiveLabel&gt;
            &lt;ns0:dateEffective&gt;02/28/2019&lt;/ns0:dateEffective&gt;
            &lt;ns0:currentBalance&gt;668&lt;/ns0:currentBalance&gt;
            &lt;ns0:highCredit&gt;611&lt;/ns0:highCredit&gt;
            &lt;ns0:accountRating&gt;G&lt;/ns0:accountRating&gt;
            &lt;ns0:remark&gt;
               &lt;ns0:code&gt;CLA&lt;/ns0:code&gt;
               &lt;ns0:type&gt;ratingHistory&lt;/ns0:type&gt;
               &lt;ns0:description&gt;&gt;PLACED FOR COLLECTION&amp;lt;&lt;/ns0:description&gt;
            &lt;/ns0:remark&gt;
            &lt;ns0:terms&gt;
               &lt;ns0:description&gt;&lt;/ns0:description&gt;
            &lt;/ns0:terms&gt;
            &lt;ns0:account&gt;
               &lt;ns0:code&gt;AG&lt;/ns0:code&gt;
               &lt;ns0:description&gt;COLLECTION AGENCY/ATTORNEY&lt;/ns0:description&gt;
            &lt;/ns0:account&gt;
            &lt;ns0:pastDue&gt;668&lt;/ns0:pastDue&gt;
            &lt;ns0:paymentHistory/&gt;
            &lt;ns0:mostRecentPayment&gt;
               &lt;ns0:description&gt;&lt;/ns0:description&gt;
            &lt;/ns0:mostRecentPayment&gt;
            &lt;ns0:additionalTradeAccount&gt;
               &lt;ns0:original&gt;
                  &lt;ns0:description&gt;NEXTEL (Cable/Cellular)&lt;/ns0:description&gt;
               &lt;/ns0:original&gt;
            &lt;/ns0:additionalTradeAccount&gt;
            &lt;ns0:suppressionFlag&gt;false&lt;/ns0:suppressionFlag&gt;
            &lt;ns0:adverseFlag&gt;true&lt;/ns0:adverseFlag&gt;
            &lt;ns0:estimatedDeletionDate&gt;09/2025&lt;/ns0:estimatedDeletionDate&gt;
            &lt;ns0:accountRatingDescription&gt;&gt;In Collection&amp;lt;&lt;/ns0:accountRatingDescription&gt;
            &lt;ns0:portfolioTypeDescription&gt;Open Account&lt;/ns0:portfolioTypeDescription&gt;
            &lt;ns0:ECOADesignatorDescription&gt;Individual Account&lt;/ns0:ECOADesignatorDescription&gt;
            &lt;ns0:histPaymentDueList&gt;&lt;/ns0:histPaymentDueList&gt;
            &lt;ns0:histPaymentAmtList&gt;&lt;/ns0:histPaymentAmtList&gt;
            &lt;ns0:histBalanceList&gt;&lt;/ns0:histBalanceList&gt;
            &lt;ns0:histPastDueList&gt;&lt;/ns0:histPastDueList&gt;
            &lt;ns0:isCollection&gt;true&lt;/ns0:isCollection&gt;
         &lt;/ns0:trade&gt;</a:CreditBureau>
      <a:InvestigationResults>&lt;ns0:fileSummary&gt;
      &lt;ns0:inFileSinceDate&gt;01/01/1990&lt;/ns0:inFileSinceDate&gt;
      &lt;ns0:disclosureCoverInfo&gt;
         &lt;ns0:coverCode&gt;15&lt;/ns0:coverCode&gt;
         &lt;ns0:versionNo&gt;1&lt;/ns0:versionNo&gt;
         &lt;ns0:disputeURL&gt;www.transunion.com/disputeonline&lt;/ns0:disputeURL&gt;
         &lt;ns0:summarySection&gt;
            &lt;ns0:lineItem&gt;
               &lt;ns0:itemKey&gt;1X5X5X8X_758M020_O&lt;/ns0:itemKey&gt;
               &lt;ns0:handle&gt;&lt;/ns0:handle&gt;
               &lt;ns0:itemType&gt;13&lt;/ns0:itemType&gt;
               &lt;ns0:credit&gt;
                  &lt;ns0:item&gt;
                     &lt;ns0:subscriber&gt;
                        &lt;ns0:name&gt;
                           &lt;ns0:unparsed&gt;ALLIED INTERSTATE INC&lt;/ns0:unparsed&gt;
                        &lt;/ns0:name&gt;
                        &lt;ns0:address&gt;
                           &lt;ns0:street&gt;
                              &lt;ns0:unparsed&gt;3000 CORPORATE ROA&lt;/ns0:unparsed&gt;
                           &lt;/ns0:street&gt;
                           &lt;ns0:location&gt;
                              &lt;ns0:unparsed&gt;COLUMBUS, OH 43231&lt;/ns0:unparsed&gt;
                              &lt;ns0:city&gt;COLUMBUS&lt;/ns0:city&gt;
                              &lt;ns0:state&gt;OH&lt;/ns0:state&gt;
                              &lt;ns0:zipCode&gt;43231&lt;/ns0:zipCode&gt;
                           &lt;/ns0:location&gt;
                        &lt;/ns0:address&gt;
                        &lt;ns0:phone&gt;
                           &lt;ns0:unparsed&gt;(877) 350-9743&lt;/ns0:unparsed&gt;
                           &lt;ns0:areaCode&gt;877&lt;/ns0:areaCode&gt;
                           &lt;ns0:exchange&gt;350&lt;/ns0:exchange&gt;
                           &lt;ns0:suffix&gt;9743&lt;/ns0:suffix&gt;
                        &lt;/ns0:phone&gt;
                     &lt;/ns0:subscriber&gt;
                  &lt;/ns0:item&gt;
                  &lt;ns0:description&gt;
                     &lt;ns0:descriptionText&gt;# 1X5X5X8X&lt;/ns0:descriptionText&gt;
                  &lt;/ns0:description&gt;
                  &lt;ns0:result&gt;VERIFIED AS ACCURATE&lt;/ns0:result&gt;
               &lt;/ns0:credit&gt;
            &lt;/ns0:lineItem&gt;
         &lt;/ns0:summarySection&gt;
         &lt;ns0:resellerOperatorId&gt; &lt;/ns0:resellerOperatorId&gt;
      &lt;/ns0:disclosureCoverInfo&gt;
   &lt;/ns0:fileSummary&gt;

&lt;ns0:trade&gt;
            &lt;ns0:itemKey&gt;1X5X5X8X_758M020_O&lt;/ns0:itemKey&gt;
            &lt;ns0:subscriber&gt;
               &lt;ns0:industryCode&gt;YC&lt;/ns0:industryCode&gt;
               &lt;ns0:memberCode&gt;758M020&lt;/ns0:memberCode&gt;
               &lt;ns0:name&gt;
                  &lt;ns0:unparsed&gt;ALLIED INTERSTATE INC&lt;/ns0:unparsed&gt;
               &lt;/ns0:name&gt;
               &lt;ns0:address&gt;
                  &lt;ns0:street&gt;
                     &lt;ns0:unparsed&gt;3000 CORPORATE ROA&lt;/ns0:unparsed&gt;
                  &lt;/ns0:street&gt;
                  &lt;ns0:location&gt;
                     &lt;ns0:unparsed&gt;COLUMBUS, OH 43231&lt;/ns0:unparsed&gt;
                     &lt;ns0:city&gt;COLUMBUS&lt;/ns0:city&gt;
                     &lt;ns0:state&gt;OH&lt;/ns0:state&gt;
                     &lt;ns0:zipCode&gt;43231&lt;/ns0:zipCode&gt;
                  &lt;/ns0:location&gt;
               &lt;/ns0:address&gt;
               &lt;ns0:phone&gt;
                  &lt;ns0:number&gt;
                     &lt;ns0:unparsed&gt;(877) 350-9743&lt;/ns0:unparsed&gt;
                     &lt;ns0:areaCode&gt;877&lt;/ns0:areaCode&gt;
                     &lt;ns0:exchange&gt;350&lt;/ns0:exchange&gt;
                     &lt;ns0:suffix&gt;9743&lt;/ns0:suffix&gt;
                  &lt;/ns0:number&gt;
               &lt;/ns0:phone&gt;
            &lt;/ns0:subscriber&gt;
            &lt;ns0:portfolioType&gt;open&lt;/ns0:portfolioType&gt;
            &lt;ns0:accountNumber&gt;1X5X5X8X&lt;/ns0:accountNumber&gt;
            &lt;ns0:ECOADesignator&gt;individual&lt;/ns0:ECOADesignator&gt;
            &lt;ns0:dateOpened&gt;11/30/2018&lt;/ns0:dateOpened&gt;
            &lt;ns0:dateEffectiveLabel&gt;DateUpdated&lt;/ns0:dateEffectiveLabel&gt;
            &lt;ns0:dateEffective&gt;02/28/2019&lt;/ns0:dateEffective&gt;
            &lt;ns0:currentBalance&gt;668&lt;/ns0:currentBalance&gt;
            &lt;ns0:highCredit&gt;611&lt;/ns0:highCredit&gt;
            &lt;ns0:accountRating&gt;G&lt;/ns0:accountRating&gt;
            &lt;ns0:remark&gt;
               &lt;ns0:code&gt;CLA&lt;/ns0:code&gt;
               &lt;ns0:type&gt;ratingHistory&lt;/ns0:type&gt;
               &lt;ns0:description&gt;&gt;PLACED FOR COLLECTION&amp;lt;&lt;/ns0:description&gt;
            &lt;/ns0:remark&gt;
            &lt;ns0:terms&gt;
               &lt;ns0:description&gt;&lt;/ns0:description&gt;
            &lt;/ns0:terms&gt;
            &lt;ns0:account&gt;
               &lt;ns0:code&gt;AG&lt;/ns0:code&gt;
               &lt;ns0:description&gt;COLLECTION AGENCY/ATTORNEY&lt;/ns0:description&gt;
            &lt;/ns0:account&gt;
            &lt;ns0:pastDue&gt;668&lt;/ns0:pastDue&gt;
            &lt;ns0:paymentHistory/&gt;
            &lt;ns0:mostRecentPayment&gt;
               &lt;ns0:description&gt;&lt;/ns0:description&gt;
            &lt;/ns0:mostRecentPayment&gt;
            &lt;ns0:additionalTradeAccount&gt;
               &lt;ns0:original&gt;
                  &lt;ns0:description&gt;NEXTEL (Cable/Cellular)&lt;/ns0:description&gt;
               &lt;/ns0:original&gt;
            &lt;/ns0:additionalTradeAccount&gt;
            &lt;ns0:suppressionFlag&gt;false&lt;/ns0:suppressionFlag&gt;
            &lt;ns0:adverseFlag&gt;true&lt;/ns0:adverseFlag&gt;
            &lt;ns0:estimatedDeletionDate&gt;09/2025&lt;/ns0:estimatedDeletionDate&gt;
            &lt;ns0:accountRatingDescription&gt;&gt;In Collection&amp;lt;&lt;/ns0:accountRatingDescription&gt;
            &lt;ns0:portfolioTypeDescription&gt;Open Account&lt;/ns0:portfolioTypeDescription&gt;
            &lt;ns0:ECOADesignatorDescription&gt;Individual Account&lt;/ns0:ECOADesignatorDescription&gt;
            &lt;ns0:histPaymentDueList&gt;&lt;/ns0:histPaymentDueList&gt;
            &lt;ns0:histPaymentAmtList&gt;&lt;/ns0:histPaymentAmtList&gt;
            &lt;ns0:histBalanceList&gt;&lt;/ns0:histBalanceList&gt;
            &lt;ns0:histPastDueList&gt;&lt;/ns0:histPastDueList&gt;
            &lt;ns0:isCollection&gt;true&lt;/ns0:isCollection&gt;
         &lt;/ns0:trade&gt;</a:InvestigationResults>
    </GetInvestigationResultsResult>
  </GetInvestigationResultsResponse>
</s:Body>
</s:Envelope>`;