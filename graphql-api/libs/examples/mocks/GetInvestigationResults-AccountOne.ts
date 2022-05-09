import { MOCK_CONFIG } from 'libs/examples/mocks/Config';

export const GET_INVESTIGATION_RESULTS_ACCOUNTONE = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body>
  <GetInvestigationResultsResponse xmlns="https://consumerconnectws.tui.transunion.com/">
    <GetInvestigationResultsResult xmlns:a="https://consumerconnectws.tui.transunion.com/data" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
      <a:AccountName>CCSIntegration</a:AccountName>
      <a:ErrorResponse i:nil="true" />
      <a:RequestKey>f214bb46-e1db-47a0-9e12-8aa90e5a922b</a:RequestKey>
      <a:ResponseType>Success</a:ResponseType>
      <a:ClientKey>${MOCK_CONFIG.userId}</a:ClientKey>
      <a:CreditBureau>&lt;ns0:fileSummary&gt;
      &lt;ns0:inFileSinceDate&gt;05/01/1993&lt;/ns0:inFileSinceDate&gt;
      &lt;ns0:disclosureCoverInfo&gt;
         &lt;ns0:coverCode&gt;15&lt;/ns0:coverCode&gt;
         &lt;ns0:versionNo&gt;1&lt;/ns0:versionNo&gt;
         &lt;ns0:disputeURL&gt;www.transunion.com/disputeonline&lt;/ns0:disputeURL&gt;
         &lt;ns0:summarySection&gt;
            &lt;ns0:lineItem&gt;
               &lt;ns0:itemKey&gt;5291459216194263_1DTV001_R&lt;/ns0:itemKey&gt;
               &lt;ns0:itemType&gt;13&lt;/ns0:itemType&gt;
               &lt;ns0:credit&gt;
                  &lt;ns0:item&gt;
                     &lt;ns0:subscriber&gt;
                        &lt;ns0:name&gt;
                           &lt;ns0:unparsed&gt;CAPITAL ONE BANK USA NA&lt;/ns0:unparsed&gt;
                        &lt;/ns0:name&gt;
                        &lt;ns0:address&gt;
                           &lt;ns0:street&gt;
                              &lt;ns0:unparsed&gt;PO BOX 30281&lt;/ns0:unparsed&gt;
                           &lt;/ns0:street&gt;
                           &lt;ns0:location&gt;
                              &lt;ns0:unparsed&gt;SALT LAKE CITY, UT 84130&lt;/ns0:unparsed&gt;
                              &lt;ns0:city&gt;SALT LAKE CITY&lt;/ns0:city&gt;
                              &lt;ns0:state&gt;UT&lt;/ns0:state&gt;
                              &lt;ns0:zipCode&gt;84130&lt;/ns0:zipCode&gt;
                           &lt;/ns0:location&gt;
                        &lt;/ns0:address&gt;
                        &lt;ns0:phone&gt;
                           &lt;ns0:unparsed&gt;(800) 258-9319&lt;/ns0:unparsed&gt;
                           &lt;ns0:areaCode&gt;800&lt;/ns0:areaCode&gt;
                           &lt;ns0:exchange&gt;258&lt;/ns0:exchange&gt;
                           &lt;ns0:suffix&gt;9319&lt;/ns0:suffix&gt;
                        &lt;/ns0:phone&gt;
                     &lt;/ns0:subscriber&gt;
                  &lt;/ns0:item&gt;
                  &lt;ns0:description&gt;
                     &lt;ns0:descriptionText&gt;# 5291459216194263&lt;/ns0:descriptionText&gt;
                  &lt;/ns0:description&gt;
                  &lt;ns0:result&gt;DELETED&lt;/ns0:result&gt;
               &lt;/ns0:credit&gt;
            &lt;/ns0:lineItem&gt;
            &lt;ns0:lineItem&gt;
               &lt;ns0:itemKey&gt;55419340652_12EN005_R&lt;/ns0:itemKey&gt;
               &lt;ns0:itemType&gt;13&lt;/ns0:itemType&gt;
               &lt;ns0:credit&gt;
                  &lt;ns0:item&gt;
                     &lt;ns0:subscriber&gt;
                        &lt;ns0:name&gt;
                           &lt;ns0:unparsed&gt;KOHLS DEPARTMENT STORE&lt;/ns0:unparsed&gt;
                        &lt;/ns0:name&gt;
                        &lt;ns0:address&gt;
                           &lt;ns0:street&gt;
                              &lt;ns0:unparsed&gt;PO BOX 3115&lt;/ns0:unparsed&gt;
                           &lt;/ns0:street&gt;
                           &lt;ns0:location&gt;
                              &lt;ns0:unparsed&gt;MILWAUKEE, WI 53201&lt;/ns0:unparsed&gt;
                              &lt;ns0:city&gt;MILWAUKEE&lt;/ns0:city&gt;
                              &lt;ns0:state&gt;WI&lt;/ns0:state&gt;
                              &lt;ns0:zipCode&gt;53201&lt;/ns0:zipCode&gt;
                           &lt;/ns0:location&gt;
                        &lt;/ns0:address&gt;
                        &lt;ns0:phone&gt;
                           &lt;ns0:unparsed&gt;(800) 564-5740&lt;/ns0:unparsed&gt;
                           &lt;ns0:areaCode&gt;800&lt;/ns0:areaCode&gt;
                           &lt;ns0:exchange&gt;564&lt;/ns0:exchange&gt;
                           &lt;ns0:suffix&gt;5740&lt;/ns0:suffix&gt;
                        &lt;/ns0:phone&gt;
                     &lt;/ns0:subscriber&gt;
                  &lt;/ns0:item&gt;
                  &lt;ns0:description&gt;
                     &lt;ns0:descriptionText&gt;# 55419340652&lt;/ns0:descriptionText&gt;
                  &lt;/ns0:description&gt;
                  &lt;ns0:result&gt;DELETED&lt;/ns0:result&gt;
               &lt;/ns0:credit&gt;
            &lt;/ns0:lineItem&gt;
            &lt;ns0:lineItem&gt;
               &lt;ns0:itemKey&gt;4266895252010709_26QK001_R&lt;/ns0:itemKey&gt;
               &lt;ns0:itemType&gt;13&lt;/ns0:itemType&gt;
               &lt;ns0:credit&gt;
                  &lt;ns0:item&gt;
                     &lt;ns0:subscriber&gt;
                        &lt;ns0:name&gt;
                           &lt;ns0:unparsed&gt;CHASE/BANK ONE CARD SERV&lt;/ns0:unparsed&gt;
                        &lt;/ns0:name&gt;
                        &lt;ns0:address&gt;
                           &lt;ns0:street&gt;
                              &lt;ns0:unparsed&gt;PO BOX 15298&lt;/ns0:unparsed&gt;
                           &lt;/ns0:street&gt;
                           &lt;ns0:location&gt;
                              &lt;ns0:unparsed&gt;WILMINGTON, DE 19850&lt;/ns0:unparsed&gt;
                              &lt;ns0:city&gt;WILMINGTON&lt;/ns0:city&gt;
                              &lt;ns0:state&gt;DE&lt;/ns0:state&gt;
                              &lt;ns0:zipCode&gt;19850&lt;/ns0:zipCode&gt;
                           &lt;/ns0:location&gt;
                        &lt;/ns0:address&gt;
                        &lt;ns0:phone&gt;
                           &lt;ns0:unparsed&gt;(800) 945-2006&lt;/ns0:unparsed&gt;
                           &lt;ns0:areaCode&gt;800&lt;/ns0:areaCode&gt;
                           &lt;ns0:exchange&gt;945&lt;/ns0:exchange&gt;
                           &lt;ns0:suffix&gt;2006&lt;/ns0:suffix&gt;
                        &lt;/ns0:phone&gt;
                     &lt;/ns0:subscriber&gt;
                  &lt;/ns0:item&gt;
                  &lt;ns0:description&gt;
                     &lt;ns0:descriptionText&gt;# 4266895252010709&lt;/ns0:descriptionText&gt;
                  &lt;/ns0:description&gt;
                  &lt;ns0:result&gt;INFORMATION UPDATED&lt;/ns0:result&gt;
                  &lt;ns0:reason&gt;No update necessary&lt;/ns0:reason&gt;
               &lt;/ns0:credit&gt;
            &lt;/ns0:lineItem&gt;
         &lt;/ns0:summarySection&gt;
         &lt;ns0:resellerOperatorId&gt; &lt;/ns0:resellerOperatorId&gt;
      &lt;/ns0:disclosureCoverInfo&gt;
   &lt;/ns0:fileSummary&gt;

&lt;ns0:custom&gt;
      &lt;ns0:credit&gt;
         &lt;ns0:trade&gt;
      &lt;ns0:trade&gt;
            &lt;ns0:itemKey&gt;4266895252010709_26QK001_R&lt;/ns0:itemKey&gt;
            &lt;ns0:subscriber&gt;
               &lt;ns0:industryCode&gt;BC&lt;/ns0:industryCode&gt;
               &lt;ns0:memberCode&gt;26QK001&lt;/ns0:memberCode&gt;
               &lt;ns0:name&gt;
                  &lt;ns0:unparsed&gt;CHASE/BANK ONE CARD SERV&lt;/ns0:unparsed&gt;
               &lt;/ns0:name&gt;
               &lt;ns0:address&gt;
                  &lt;ns0:street&gt;
                     &lt;ns0:unparsed&gt;PO BOX 15298&lt;/ns0:unparsed&gt;
                  &lt;/ns0:street&gt;
                  &lt;ns0:location&gt;
                     &lt;ns0:unparsed&gt;WILMINGTON, DE 19850&lt;/ns0:unparsed&gt;
                     &lt;ns0:city&gt;WILMINGTON&lt;/ns0:city&gt;
                     &lt;ns0:state&gt;DE&lt;/ns0:state&gt;
                     &lt;ns0:zipCode&gt;19850&lt;/ns0:zipCode&gt;
                  &lt;/ns0:location&gt;
               &lt;/ns0:address&gt;
               &lt;ns0:phone&gt;
                  &lt;ns0:number&gt;
                     &lt;ns0:unparsed&gt;(800) 945-2006&lt;/ns0:unparsed&gt;
                     &lt;ns0:areaCode&gt;800&lt;/ns0:areaCode&gt;
                     &lt;ns0:exchange&gt;945&lt;/ns0:exchange&gt;
                     &lt;ns0:suffix&gt;2006&lt;/ns0:suffix&gt;
                  &lt;/ns0:number&gt;
               &lt;/ns0:phone&gt;
            &lt;/ns0:subscriber&gt;
            &lt;ns0:portfolioType&gt;revolving&lt;/ns0:portfolioType&gt;
            &lt;ns0:accountNumber&gt;4266895252010709&lt;/ns0:accountNumber&gt;
            &lt;ns0:ECOADesignator&gt;individual&lt;/ns0:ECOADesignator&gt;
            &lt;ns0:dateOpened&gt;10/31/2005&lt;/ns0:dateOpened&gt;
            &lt;ns0:dateEffectiveLabel&gt;DateUpdated&lt;/ns0:dateEffectiveLabel&gt;
            &lt;ns0:dateEffective&gt;12/18/2018&lt;/ns0:dateEffective&gt;
            &lt;ns0:currentBalance&gt;281&lt;/ns0:currentBalance&gt;
            &lt;ns0:highCredit&gt;17790&lt;/ns0:highCredit&gt;
            &lt;ns0:creditLimit&gt;32000&lt;/ns0:creditLimit&gt;
            &lt;ns0:accountRating&gt;01&lt;/ns0:accountRating&gt;
            &lt;ns0:terms&gt;
               &lt;ns0:paymentFrequency&gt;monthly&lt;/ns0:paymentFrequency&gt;
               &lt;ns0:scheduledMonthlyPayment&gt;$14&lt;/ns0:scheduledMonthlyPayment&gt;
               &lt;ns0:description&gt;$14 per month, paid Monthly&lt;/ns0:description&gt;
            &lt;/ns0:terms&gt;
            &lt;ns0:account&gt;
               &lt;ns0:code&gt;CC&lt;/ns0:code&gt;
               &lt;ns0:description&gt;CREDIT CARD&lt;/ns0:description&gt;
            &lt;/ns0:account&gt;
            &lt;ns0:paymentHistory&gt;
               &lt;ns0:paymentPattern&gt;
                  &lt;ns0:startDate&gt;11/01/2018&lt;/ns0:startDate&gt;
                  &lt;ns0:text&gt;1111111111111111111111111111111111111111111111111111111111111111111111111111111111&lt;/ns0:text&gt;
               &lt;/ns0:paymentPattern&gt;
               &lt;ns0:historicalCounters&gt;
                  &lt;ns0:monthsReviewedCount&gt;82&lt;/ns0:monthsReviewedCount&gt;
                  &lt;ns0:late30DaysTotal&gt;0&lt;/ns0:late30DaysTotal&gt;
                  &lt;ns0:late60DaysTotal&gt;0&lt;/ns0:late60DaysTotal&gt;
                  &lt;ns0:late90DaysTotal&gt;0&lt;/ns0:late90DaysTotal&gt;
               &lt;/ns0:historicalCounters&gt;
            &lt;/ns0:paymentHistory&gt;
            &lt;ns0:mostRecentPayment&gt;
               &lt;ns0:amount&gt;$200&lt;/ns0:amount&gt;
               &lt;ns0:date&gt;12/10/2018&lt;/ns0:date&gt;
               &lt;ns0:description&gt;12/10/2018 ($200)&lt;/ns0:description&gt;
            &lt;/ns0:mostRecentPayment&gt;
            &lt;ns0:additionalTradeAccount&gt;
               &lt;ns0:original/&gt;
            &lt;/ns0:additionalTradeAccount&gt;
            &lt;ns0:suppressionFlag&gt;false&lt;/ns0:suppressionFlag&gt;
            &lt;ns0:adverseFlag&gt;false&lt;/ns0:adverseFlag&gt;
            &lt;ns0:accountRatingDescription&gt;Current; Paid or Paying as Agreed&lt;/ns0:accountRatingDescription&gt;
            &lt;ns0:portfolioTypeDescription&gt;Revolving Account&lt;/ns0:portfolioTypeDescription&gt;
            &lt;ns0:ECOADesignatorDescription&gt;Individual Account&lt;/ns0:ECOADesignatorDescription&gt;
            &lt;ns0:histPaymentDueList&gt;&lt;/ns0:histPaymentDueList&gt;
            &lt;ns0:histPaymentAmtList&gt;&lt;/ns0:histPaymentAmtList&gt;
            &lt;ns0:histBalanceList&gt;&lt;/ns0:histBalanceList&gt;
            &lt;ns0:histPastDueList&gt;&lt;/ns0:histPastDueList&gt;
            &lt;ns0:histRemarkList&gt;&lt;/ns0:histRemarkList&gt;
            &lt;ns0:isCollection&gt;false&lt;/ns0:isCollection&gt;
         &lt;/ns0:trade&gt;</a:CreditBureau>
      <a:InvestigationResults>&lt;ns0:fileSummary&gt;
      &lt;ns0:inFileSinceDate&gt;05/01/1993&lt;/ns0:inFileSinceDate&gt;
      &lt;ns0:disclosureCoverInfo&gt;
         &lt;ns0:coverCode&gt;15&lt;/ns0:coverCode&gt;
         &lt;ns0:versionNo&gt;1&lt;/ns0:versionNo&gt;
         &lt;ns0:disputeURL&gt;www.transunion.com/disputeonline&lt;/ns0:disputeURL&gt;
         &lt;ns0:summarySection&gt;
            &lt;ns0:lineItem&gt;
               &lt;ns0:itemKey&gt;5291459216194263_1DTV001_R&lt;/ns0:itemKey&gt;
               &lt;ns0:itemType&gt;13&lt;/ns0:itemType&gt;
               &lt;ns0:credit&gt;
                  &lt;ns0:item&gt;
                     &lt;ns0:subscriber&gt;
                        &lt;ns0:name&gt;
                           &lt;ns0:unparsed&gt;CAPITAL ONE BANK USA NA&lt;/ns0:unparsed&gt;
                        &lt;/ns0:name&gt;
                        &lt;ns0:address&gt;
                           &lt;ns0:street&gt;
                              &lt;ns0:unparsed&gt;PO BOX 30281&lt;/ns0:unparsed&gt;
                           &lt;/ns0:street&gt;
                           &lt;ns0:location&gt;
                              &lt;ns0:unparsed&gt;SALT LAKE CITY, UT 84130&lt;/ns0:unparsed&gt;
                              &lt;ns0:city&gt;SALT LAKE CITY&lt;/ns0:city&gt;
                              &lt;ns0:state&gt;UT&lt;/ns0:state&gt;
                              &lt;ns0:zipCode&gt;84130&lt;/ns0:zipCode&gt;
                           &lt;/ns0:location&gt;
                        &lt;/ns0:address&gt;
                        &lt;ns0:phone&gt;
                           &lt;ns0:unparsed&gt;(800) 258-9319&lt;/ns0:unparsed&gt;
                           &lt;ns0:areaCode&gt;800&lt;/ns0:areaCode&gt;
                           &lt;ns0:exchange&gt;258&lt;/ns0:exchange&gt;
                           &lt;ns0:suffix&gt;9319&lt;/ns0:suffix&gt;
                        &lt;/ns0:phone&gt;
                     &lt;/ns0:subscriber&gt;
                  &lt;/ns0:item&gt;
                  &lt;ns0:description&gt;
                     &lt;ns0:descriptionText&gt;# 5291459216194263&lt;/ns0:descriptionText&gt;
                  &lt;/ns0:description&gt;
                  &lt;ns0:result&gt;DELETED&lt;/ns0:result&gt;
               &lt;/ns0:credit&gt;
            &lt;/ns0:lineItem&gt;
            &lt;ns0:lineItem&gt;
               &lt;ns0:itemKey&gt;55419340652_12EN005_R&lt;/ns0:itemKey&gt;
               &lt;ns0:itemType&gt;13&lt;/ns0:itemType&gt;
               &lt;ns0:credit&gt;
                  &lt;ns0:item&gt;
                     &lt;ns0:subscriber&gt;
                        &lt;ns0:name&gt;
                           &lt;ns0:unparsed&gt;KOHLS DEPARTMENT STORE&lt;/ns0:unparsed&gt;
                        &lt;/ns0:name&gt;
                        &lt;ns0:address&gt;
                           &lt;ns0:street&gt;
                              &lt;ns0:unparsed&gt;PO BOX 3115&lt;/ns0:unparsed&gt;
                           &lt;/ns0:street&gt;
                           &lt;ns0:location&gt;
                              &lt;ns0:unparsed&gt;MILWAUKEE, WI 53201&lt;/ns0:unparsed&gt;
                              &lt;ns0:city&gt;MILWAUKEE&lt;/ns0:city&gt;
                              &lt;ns0:state&gt;WI&lt;/ns0:state&gt;
                              &lt;ns0:zipCode&gt;53201&lt;/ns0:zipCode&gt;
                           &lt;/ns0:location&gt;
                        &lt;/ns0:address&gt;
                        &lt;ns0:phone&gt;
                           &lt;ns0:unparsed&gt;(800) 564-5740&lt;/ns0:unparsed&gt;
                           &lt;ns0:areaCode&gt;800&lt;/ns0:areaCode&gt;
                           &lt;ns0:exchange&gt;564&lt;/ns0:exchange&gt;
                           &lt;ns0:suffix&gt;5740&lt;/ns0:suffix&gt;
                        &lt;/ns0:phone&gt;
                     &lt;/ns0:subscriber&gt;
                  &lt;/ns0:item&gt;
                  &lt;ns0:description&gt;
                     &lt;ns0:descriptionText&gt;# 55419340652&lt;/ns0:descriptionText&gt;
                  &lt;/ns0:description&gt;
                  &lt;ns0:result&gt;DELETED&lt;/ns0:result&gt;
               &lt;/ns0:credit&gt;
            &lt;/ns0:lineItem&gt;
            &lt;ns0:lineItem&gt;
               &lt;ns0:itemKey&gt;4266895252010709_26QK001_R&lt;/ns0:itemKey&gt;
               &lt;ns0:itemType&gt;13&lt;/ns0:itemType&gt;
               &lt;ns0:credit&gt;
                  &lt;ns0:item&gt;
                     &lt;ns0:subscriber&gt;
                        &lt;ns0:name&gt;
                           &lt;ns0:unparsed&gt;CHASE/BANK ONE CARD SERV&lt;/ns0:unparsed&gt;
                        &lt;/ns0:name&gt;
                        &lt;ns0:address&gt;
                           &lt;ns0:street&gt;
                              &lt;ns0:unparsed&gt;PO BOX 15298&lt;/ns0:unparsed&gt;
                           &lt;/ns0:street&gt;
                           &lt;ns0:location&gt;
                              &lt;ns0:unparsed&gt;WILMINGTON, DE 19850&lt;/ns0:unparsed&gt;
                              &lt;ns0:city&gt;WILMINGTON&lt;/ns0:city&gt;
                              &lt;ns0:state&gt;DE&lt;/ns0:state&gt;
                              &lt;ns0:zipCode&gt;19850&lt;/ns0:zipCode&gt;
                           &lt;/ns0:location&gt;
                        &lt;/ns0:address&gt;
                        &lt;ns0:phone&gt;
                           &lt;ns0:unparsed&gt;(800) 945-2006&lt;/ns0:unparsed&gt;
                           &lt;ns0:areaCode&gt;800&lt;/ns0:areaCode&gt;
                           &lt;ns0:exchange&gt;945&lt;/ns0:exchange&gt;
                           &lt;ns0:suffix&gt;2006&lt;/ns0:suffix&gt;
                        &lt;/ns0:phone&gt;
                     &lt;/ns0:subscriber&gt;
                  &lt;/ns0:item&gt;
                  &lt;ns0:description&gt;
                     &lt;ns0:descriptionText&gt;# 4266895252010709&lt;/ns0:descriptionText&gt;
                  &lt;/ns0:description&gt;
                  &lt;ns0:result&gt;INFORMATION UPDATED&lt;/ns0:result&gt;
                  &lt;ns0:reason&gt;No update necessary&lt;/ns0:reason&gt;
               &lt;/ns0:credit&gt;
            &lt;/ns0:lineItem&gt;
         &lt;/ns0:summarySection&gt;
         &lt;ns0:resellerOperatorId&gt; &lt;/ns0:resellerOperatorId&gt;
      &lt;/ns0:disclosureCoverInfo&gt;
   &lt;/ns0:fileSummary&gt;

&lt;ns0:custom&gt;
      &lt;ns0:credit&gt;
         &lt;ns0:trade&gt;
      &lt;ns0:trade&gt;
            &lt;ns0:itemKey&gt;4266895252010709_26QK001_R&lt;/ns0:itemKey&gt;
            &lt;ns0:subscriber&gt;
               &lt;ns0:industryCode&gt;BC&lt;/ns0:industryCode&gt;
               &lt;ns0:memberCode&gt;26QK001&lt;/ns0:memberCode&gt;
               &lt;ns0:name&gt;
                  &lt;ns0:unparsed&gt;CHASE/BANK ONE CARD SERV&lt;/ns0:unparsed&gt;
               &lt;/ns0:name&gt;
               &lt;ns0:address&gt;
                  &lt;ns0:street&gt;
                     &lt;ns0:unparsed&gt;PO BOX 15298&lt;/ns0:unparsed&gt;
                  &lt;/ns0:street&gt;
                  &lt;ns0:location&gt;
                     &lt;ns0:unparsed&gt;WILMINGTON, DE 19850&lt;/ns0:unparsed&gt;
                     &lt;ns0:city&gt;WILMINGTON&lt;/ns0:city&gt;
                     &lt;ns0:state&gt;DE&lt;/ns0:state&gt;
                     &lt;ns0:zipCode&gt;19850&lt;/ns0:zipCode&gt;
                  &lt;/ns0:location&gt;
               &lt;/ns0:address&gt;
               &lt;ns0:phone&gt;
                  &lt;ns0:number&gt;
                     &lt;ns0:unparsed&gt;(800) 945-2006&lt;/ns0:unparsed&gt;
                     &lt;ns0:areaCode&gt;800&lt;/ns0:areaCode&gt;
                     &lt;ns0:exchange&gt;945&lt;/ns0:exchange&gt;
                     &lt;ns0:suffix&gt;2006&lt;/ns0:suffix&gt;
                  &lt;/ns0:number&gt;
               &lt;/ns0:phone&gt;
            &lt;/ns0:subscriber&gt;
            &lt;ns0:portfolioType&gt;revolving&lt;/ns0:portfolioType&gt;
            &lt;ns0:accountNumber&gt;4266895252010709&lt;/ns0:accountNumber&gt;
            &lt;ns0:ECOADesignator&gt;individual&lt;/ns0:ECOADesignator&gt;
            &lt;ns0:dateOpened&gt;10/31/2005&lt;/ns0:dateOpened&gt;
            &lt;ns0:dateEffectiveLabel&gt;DateUpdated&lt;/ns0:dateEffectiveLabel&gt;
            &lt;ns0:dateEffective&gt;12/18/2018&lt;/ns0:dateEffective&gt;
            &lt;ns0:currentBalance&gt;281&lt;/ns0:currentBalance&gt;
            &lt;ns0:highCredit&gt;17790&lt;/ns0:highCredit&gt;
            &lt;ns0:creditLimit&gt;32000&lt;/ns0:creditLimit&gt;
            &lt;ns0:accountRating&gt;01&lt;/ns0:accountRating&gt;
            &lt;ns0:terms&gt;
               &lt;ns0:paymentFrequency&gt;monthly&lt;/ns0:paymentFrequency&gt;
               &lt;ns0:scheduledMonthlyPayment&gt;$14&lt;/ns0:scheduledMonthlyPayment&gt;
               &lt;ns0:description&gt;$14 per month, paid Monthly&lt;/ns0:description&gt;
            &lt;/ns0:terms&gt;
            &lt;ns0:account&gt;
               &lt;ns0:code&gt;CC&lt;/ns0:code&gt;
               &lt;ns0:description&gt;CREDIT CARD&lt;/ns0:description&gt;
            &lt;/ns0:account&gt;
            &lt;ns0:paymentHistory&gt;
               &lt;ns0:paymentPattern&gt;
                  &lt;ns0:startDate&gt;11/01/2018&lt;/ns0:startDate&gt;
                  &lt;ns0:text&gt;1111111111111111111111111111111111111111111111111111111111111111111111111111111111&lt;/ns0:text&gt;
               &lt;/ns0:paymentPattern&gt;
               &lt;ns0:historicalCounters&gt;
                  &lt;ns0:monthsReviewedCount&gt;82&lt;/ns0:monthsReviewedCount&gt;
                  &lt;ns0:late30DaysTotal&gt;0&lt;/ns0:late30DaysTotal&gt;
                  &lt;ns0:late60DaysTotal&gt;0&lt;/ns0:late60DaysTotal&gt;
                  &lt;ns0:late90DaysTotal&gt;0&lt;/ns0:late90DaysTotal&gt;
               &lt;/ns0:historicalCounters&gt;
            &lt;/ns0:paymentHistory&gt;
            &lt;ns0:mostRecentPayment&gt;
               &lt;ns0:amount&gt;$200&lt;/ns0:amount&gt;
               &lt;ns0:date&gt;12/10/2018&lt;/ns0:date&gt;
               &lt;ns0:description&gt;12/10/2018 ($200)&lt;/ns0:description&gt;
            &lt;/ns0:mostRecentPayment&gt;
            &lt;ns0:additionalTradeAccount&gt;
               &lt;ns0:original/&gt;
            &lt;/ns0:additionalTradeAccount&gt;
            &lt;ns0:suppressionFlag&gt;false&lt;/ns0:suppressionFlag&gt;
            &lt;ns0:adverseFlag&gt;false&lt;/ns0:adverseFlag&gt;
            &lt;ns0:accountRatingDescription&gt;Current; Paid or Paying as Agreed&lt;/ns0:accountRatingDescription&gt;
            &lt;ns0:portfolioTypeDescription&gt;Revolving Account&lt;/ns0:portfolioTypeDescription&gt;
            &lt;ns0:ECOADesignatorDescription&gt;Individual Account&lt;/ns0:ECOADesignatorDescription&gt;
            &lt;ns0:histPaymentDueList&gt;&lt;/ns0:histPaymentDueList&gt;
            &lt;ns0:histPaymentAmtList&gt;&lt;/ns0:histPaymentAmtList&gt;
            &lt;ns0:histBalanceList&gt;&lt;/ns0:histBalanceList&gt;
            &lt;ns0:histPastDueList&gt;&lt;/ns0:histPastDueList&gt;
            &lt;ns0:histRemarkList&gt;&lt;/ns0:histRemarkList&gt;
            &lt;ns0:isCollection&gt;false&lt;/ns0:isCollection&gt;
         &lt;/ns0:trade&gt;</a:InvestigationResults>
    </GetInvestigationResultsResult>
  </GetInvestigationResultsResponse>
</s:Body>
</s:Envelope>`;