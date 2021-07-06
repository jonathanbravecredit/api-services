export const GET_INVESTIGATION_RESULTS_RESPONSE = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body>
  <GetInvestigationResultsResponse xmlns="https://consumerconnectws.tui.transunion.com/">
    <GetInvestigationResultsResult xmlns:a="https://consumerconnectws.tui.transunion.com/data"
      xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
      <a:AccountName>CCSIntegration</a:AccountName>
      <a:ErrorResponse i:nil="true"/>
      <a:RequestKey>f214bb46-e1db-47a0-9e12-8aa90e5a922b</a:RequestKey>
      <a:ResponseType>Success</a:ResponseType>
      <a:ClientKey>SR_2018-03-09_13-33-18_DORA</a:ClientKey>
      <a:CreditBureau><![CDATA[<?xml version="1.0" encoding="UTF-8"?>
<ns0:creditBureau xmlns:ns1="com.tuc.common" xmlns:ns0="http://www.transunion.com/disclosure">
 <ns0:version>2</ns0:version>
 <ns0:transactionControl>
    <ns0:tracking>
       <ns0:transactionTimeStamp>2018-03-09T13:38:31.131-06:00</ns0:transactionTimeStamp>
       <ns0:language>en</ns0:language>
       <ns0:identifier>
          <ns1:fin>000300010987</ns1:fin>
          <ns1:activityNumber>109</ns1:activityNumber>
          <ns1:partyId>1078425505</ns1:partyId>
       </ns0:identifier>
       <ns0:responseCode>0</ns0:responseCode>
       <ns0:responseMessage>Success</ns0:responseMessage>
    </ns0:tracking>
 </ns0:transactionControl>
 <ns0:productArray>
    <ns0:product>
       <ns0:code>7001</ns0:code>
       <ns0:subject>
          <ns0:fileAccessCode>*** 300010987-109 ***</ns0:fileAccessCode>
          <ns0:enclosures>
             <ns0:codes>
                <ns0:code>28</ns0:code>
                <ns0:type>00</ns0:type>
                <ns0:versionNo>1</ns0:versionNo>
             </ns0:codes>
             <ns0:codes>
                <ns0:code>29</ns0:code>
                <ns0:type>00</ns0:type>
                <ns0:versionNo>1</ns0:versionNo>
             </ns0:codes>
             <ns0:codes>
                <ns0:code>32</ns0:code>
                <ns0:type>00</ns0:type>
                <ns0:versionNo>1</ns0:versionNo>
             </ns0:codes>
             <ns0:addresseeContact>
                <ns0:name>
                   <ns0:unparsed>DORA G. JULIEN</ns0:unparsed>
                </ns0:name>
                <ns0:address>
                   <ns0:street>
                      <ns0:unparsed>PO BOX 384</ns0:unparsed>
                   </ns0:street>
                   <ns0:location>
                      <ns0:unparsed>BRAHAM, MN 55006-0384</ns0:unparsed>
                   </ns0:location>
                   <ns0:order>1</ns0:order>
                </ns0:address>
             </ns0:addresseeContact>
             <ns0:returnMailContact>
                <ns0:name>
                   <ns0:unparsed>TransUnion Consumer Relations</ns0:unparsed>
                </ns0:name>
                <ns0:address>
                   <ns0:street>
                      <ns0:unparsed>P.O. Box 2000</ns0:unparsed>
                   </ns0:street>
                   <ns0:location>
                      <ns0:unparsed>Chester, PA 19016-2000</ns0:unparsed>
                   </ns0:location>
                   <ns0:order>1</ns0:order>
                </ns0:address>
             </ns0:returnMailContact>
          </ns0:enclosures>
          <ns0:subjectRecord>
             <ns0:fileSummary>
                <ns0:inFileSinceDate>06/25/2006</ns0:inFileSinceDate>
                <ns0:disclosureCoverInfo>
                   <ns0:coverCode>15</ns0:coverCode>
                   <ns0:versionNo>1</ns0:versionNo>
                   <ns0:disputeURL>www.transunion.com/disputeonline</ns0:disputeURL>
                   <ns0:summarySection>
                      <ns0:lineItem>
                         <ns0:itemKey>9X4X6X3_4871356_7X</ns0:itemKey>
                         <ns0:itemType>14</ns0:itemType>
                         <ns0:credit>
                            <ns0:item>
                               <ns0:itemName>CHAPTER 7 BANKRUPTCY DISCHARGED</ns0:itemName>
                               <ns0:subscriber>
                                  <ns0:name>
                                     <ns0:unparsed>MINNESOTA FEDERAL COURT-</ns0:unparsed>
                                  </ns0:name>
                                  <ns0:address>
                                     <ns0:street>
                                        <ns0:unparsed>300 S 4TH STREET</ns0:unparsed>
                                     </ns0:street>
                                     <ns0:location>
                                        <ns0:unparsed>MINNEAPOLIS, MN 55415</ns0:unparsed>
                                        <ns0:city>MINNEAPOLIS</ns0:city>
                                        <ns0:state>MN</ns0:state>
                                        <ns0:zipCode>55415</ns0:zipCode>
                                     </ns0:location>
                                  </ns0:address>
                                  <ns0:phone>
                                     <ns0:unparsed>(612) 664-5200</ns0:unparsed>
                                     <ns0:areaCode>612</ns0:areaCode>
                                     <ns0:exchange>664</ns0:exchange>
                                     <ns0:suffix>5200</ns0:suffix>
                                  </ns0:phone>
                               </ns0:subscriber>
                            </ns0:item>
                            <ns0:description>
                               <ns0:descriptionText>DOCKET# 9X4X6X3</ns0:descriptionText>
                            </ns0:description>
                            <ns0:result>VERIFIED AS ACCURATE</ns0:result>
                         </ns0:credit>
                      </ns0:lineItem>
                      <ns0:lineItem>
                         <ns0:itemKey>5X5X2X1X7X0X0_1972038_R</ns0:itemKey>
                         <ns0:itemType>13</ns0:itemType>
                         <ns0:credit>
                            <ns0:item>
                               <ns0:subscriber>
                                  <ns0:name>
                                     <ns0:unparsed>JC PENNEY</ns0:unparsed>
                                  </ns0:name>
                                  <ns0:address>
                                     <ns0:street>
                                        <ns0:unparsed>PO BOX 981026</ns0:unparsed>
                                     </ns0:street>
                                     <ns0:location>
                                        <ns0:unparsed>EL PASO, TX 79998-1206</ns0:unparsed>
                                        <ns0:city>EL PASO</ns0:city>
                                        <ns0:state>TX</ns0:state>
                                        <ns0:zipCode>79998</ns0:zipCode>
                                        <ns0:zipExt>1206</ns0:zipExt>
                                     </ns0:location>
                                  </ns0:address>
                                  <ns0:phone>
                                     <ns0:unparsed>(800) 542-0800</ns0:unparsed>
                                     <ns0:areaCode>800</ns0:areaCode>
                                     <ns0:exchange>542</ns0:exchange>
                                     <ns0:suffix>0800</ns0:suffix>
                                  </ns0:phone>
                               </ns0:subscriber>
                            </ns0:item>
                            <ns0:description>
                               <ns0:descriptionText># 5X5X2X1X7X0X0</ns0:descriptionText>
                            </ns0:description>
                            <ns0:result>DELETED</ns0:result>
                         </ns0:credit>
                      </ns0:lineItem>
                   </ns0:summarySection>
                   <ns0:resellerOperatorId> </ns0:resellerOperatorId>
                </ns0:disclosureCoverInfo>
             </ns0:fileSummary>
             <ns0:indicative>
                <ns0:name>
                   <ns0:person>
                      <ns0:unparsed>DORA G. JULIEN</ns0:unparsed>
                      <ns0:first>DORA</ns0:first>
                      <ns0:middle>G</ns0:middle>
                      <ns0:last>JULIEN</ns0:last>
                      <ns0:order>1</ns0:order>
                   </ns0:person>
                </ns0:name>
                <ns0:address>
                   <ns0:street>
                      <ns0:unparsed>PO BOX 384</ns0:unparsed>
                      <ns0:number>384</ns0:number>
                      <ns0:name>PO BOX</ns0:name>
                   </ns0:street>
                   <ns0:location>
                      <ns0:unparsed>BRAHAM, MN 55006-0384</ns0:unparsed>
                      <ns0:city>BRAHAM</ns0:city>
                      <ns0:state>MN</ns0:state>
                      <ns0:zipCode>55006</ns0:zipCode>
                      <ns0:zipExt>0384</ns0:zipExt>
                   </ns0:location>
                   <ns0:dateReported>09/02/2015</ns0:dateReported>
                   <ns0:order>1</ns0:order>
                </ns0:address>
                <ns0:socialSecurity>
                   <ns0:number>471-86-6871</ns0:number>
                   <ns0:order>1</ns0:order>
                </ns0:socialSecurity>
             </ns0:indicative>
             <ns0:custom>
                <ns0:credit>
                   <ns0:trade>
                      <ns0:itemKey>4X2X7X1X9X2X5X6X_927P029_R</ns0:itemKey>
                      <ns0:subscriber>
                         <ns0:industryCode>BY</ns0:industryCode>
                         <ns0:memberCode>927P029</ns0:memberCode>
                         <ns0:name>
                            <ns0:unparsed>CARD PRODUCTS</ns0:unparsed>
                         </ns0:name>
                         <ns0:address>
                            <ns0:street>
                               <ns0:unparsed>PO BOX 563966</ns0:unparsed>
                            </ns0:street>
                            <ns0:location>
                               <ns0:unparsed>CHARLOTTE, NC 28256-0001</ns0:unparsed>
                               <ns0:city>CHARLOTTE</ns0:city>
                               <ns0:state>NC</ns0:state>
                               <ns0:zipCode>28256</ns0:zipCode>
                               <ns0:zipExt>0001</ns0:zipExt>
                            </ns0:location>
                         </ns0:address>
                         <ns0:phone>
                            <ns0:number>
                               <ns0:unparsed>Phone number not available</ns0:unparsed>
                            </ns0:number>
                         </ns0:phone>
                      </ns0:subscriber>
                      <ns0:portfolioType>revolving</ns0:portfolioType>
                      <ns0:accountNumber>4X2X7X1X9X2X5X6X</ns0:accountNumber>
                      <ns0:ECOADesignator>individual</ns0:ECOADesignator>
                      <ns0:dateOpened>06/16/2013</ns0:dateOpened>
                      <ns0:dateEffectiveLabel>DateUpdated</ns0:dateEffectiveLabel>
                      <ns0:dateEffective>11/05/2016</ns0:dateEffective>
                      <ns0:dateClosed>09/26/2015</ns0:dateClosed>
                      <ns0:highCredit>4930</ns0:highCredit>
                      <ns0:accountRating>BK</ns0:accountRating>
                      <ns0:remark>
                         <ns0:code>BKL</ns0:code>
                         <ns0:type>affiliate</ns0:type>
                         <ns0:description>>INCLUDED IN BANKRUPTCY&lt;</ns0:description>
                      </ns0:remark>
                      <ns0:terms>
                         <ns0:description></ns0:description>
                      </ns0:terms>
                      <ns0:account>
                         <ns0:code>CC</ns0:code>
                         <ns0:description>CREDIT CARD</ns0:description>
                      </ns0:account>
                      <ns0:paymentHistory/>
                      <ns0:mostRecentPayment>
                         <ns0:date>05/31/2015</ns0:date>
                         <ns0:description></ns0:description>
                      </ns0:mostRecentPayment>
                      <ns0:additionalTradeAccount>
                         <ns0:original/>
                      </ns0:additionalTradeAccount>
                      <ns0:suppressionFlag>false</ns0:suppressionFlag>
                      <ns0:adverseFlag>true</ns0:adverseFlag>
                      <ns0:estimatedDeletionDate>10/2022</ns0:estimatedDeletionDate>
                      <ns0:accountRatingDescription>>Account Included in Bankruptcy&lt;</ns0:accountRatingDescription>
                      <ns0:portfolioTypeDescription>Revolving Account</ns0:portfolioTypeDescription>
                      <ns0:ECOADesignatorDescription>Individual Account</ns0:ECOADesignatorDescription>
                      <ns0:histPaymentDueList></ns0:histPaymentDueList>
                      <ns0:histPaymentAmtList></ns0:histPaymentAmtList>
                      <ns0:histBalanceList></ns0:histBalanceList>
                      <ns0:histPastDueList></ns0:histPastDueList>
                      <ns0:histRemarkList></ns0:histRemarkList>
                      <ns0:isCollection>false</ns0:isCollection>
                   </ns0:trade>
                   <ns0:trade>
                      <ns0:itemKey>4X2X1X0X2X0X5X0X_402D013_R</ns0:itemKey>
                      <ns0:subscriber>
                         <ns0:industryCode>BC</ns0:industryCode>
                         <ns0:memberCode>402D013</ns0:memberCode>
                         <ns0:name>
                            <ns0:unparsed>CHASE NA</ns0:unparsed>
                         </ns0:name>
                         <ns0:address>
                            <ns0:street>
                               <ns0:unparsed>880 BROOKS EDGE BLVD</ns0:unparsed>
                            </ns0:street>
                            <ns0:location>
                               <ns0:unparsed>WESTERVILLE, OH 43081</ns0:unparsed>
                               <ns0:city>WESTERVILLE</ns0:city>
                               <ns0:state>OH</ns0:state>
                               <ns0:zipCode>43081</ns0:zipCode>
                            </ns0:location>
                         </ns0:address>
                         <ns0:phone>
                            <ns0:number>
                               <ns0:unparsed>Phone number not available</ns0:unparsed>
                            </ns0:number>
                         </ns0:phone>
                      </ns0:subscriber>
                      <ns0:portfolioType>revolving</ns0:portfolioType>
                      <ns0:accountNumber>4X2X1X0X2X0X5X0X</ns0:accountNumber>
                      <ns0:ECOADesignator>individual</ns0:ECOADesignator>
                      <ns0:dateOpened>02/08/2013</ns0:dateOpened>
                      <ns0:dateEffectiveLabel>DateUpdated</ns0:dateEffectiveLabel>
                      <ns0:dateEffective>11/04/2015</ns0:dateEffective>
                      <ns0:dateClosed>08/01/2015</ns0:dateClosed>
                      <ns0:datePaidOut>10/13/2015</ns0:datePaidOut>
                      <ns0:currentBalance>0</ns0:currentBalance>
                      <ns0:highCredit>4666</ns0:highCredit>
                      <ns0:creditLimit>4600</ns0:creditLimit>
                      <ns0:accountRating>BK</ns0:accountRating>
                      <ns0:remark>
                         <ns0:code>CBL</ns0:code>
                         <ns0:type>affiliate</ns0:type>
                         <ns0:description>>CHAPTER 7 BANKRUPTCY&lt;</ns0:description>
                      </ns0:remark>
                      <ns0:terms>
                         <ns0:description></ns0:description>
                      </ns0:terms>
                      <ns0:paymentHistory/>
                      <ns0:mostRecentPayment>
                         <ns0:date>07/19/2015</ns0:date>
                         <ns0:description></ns0:description>
                      </ns0:mostRecentPayment>
                      <ns0:additionalTradeAccount>
                         <ns0:original/>
                      </ns0:additionalTradeAccount>
                      <ns0:suppressionFlag>false</ns0:suppressionFlag>
                      <ns0:adverseFlag>true</ns0:adverseFlag>
                      <ns0:estimatedDeletionDate>04/2022</ns0:estimatedDeletionDate>
                      <ns0:accountRatingDescription>>Account Included in Bankruptcy&lt;</ns0:accountRatingDescription>
                      <ns0:portfolioTypeDescription>Revolving Account</ns0:portfolioTypeDescription>
                      <ns0:ECOADesignatorDescription>Individual Account</ns0:ECOADesignatorDescription>
                      <ns0:histPaymentDueList></ns0:histPaymentDueList>
                      <ns0:histPaymentAmtList></ns0:histPaymentAmtList>
                      <ns0:histBalanceList></ns0:histBalanceList>
                      <ns0:histPastDueList></ns0:histPastDueList>
                      <ns0:histRemarkList></ns0:histRemarkList>
                      <ns0:isCollection>false</ns0:isCollection>
                   </ns0:trade>
                   <ns0:trade>
                      <ns0:itemKey>5X9X5X9X0X1X1X9X_8194006_R</ns0:itemKey>
                      <ns0:subscriber>
                         <ns0:industryCode>BC</ns0:industryCode>
                         <ns0:memberCode>8194006</ns0:memberCode>
                         <ns0:name>
                            <ns0:unparsed>CITIBANK UCS</ns0:unparsed>
                         </ns0:name>
                         <ns0:address>
                            <ns0:street>
                               <ns0:unparsed>701 E 60TH ST N</ns0:unparsed>
                            </ns0:street>
                            <ns0:location>
                               <ns0:unparsed>SIOUX FALLS, SD 57104</ns0:unparsed>
                               <ns0:city>SIOUX FALLS</ns0:city>
                               <ns0:state>SD</ns0:state>
                               <ns0:zipCode>57104</ns0:zipCode>
                            </ns0:location>
                         </ns0:address>
                         <ns0:phone>
                            <ns0:number>
                               <ns0:unparsed>(904) 954-7500</ns0:unparsed>
                               <ns0:areaCode>904</ns0:areaCode>
                               <ns0:exchange>954</ns0:exchange>
                               <ns0:suffix>7500</ns0:suffix>
                            </ns0:number>
                         </ns0:phone>
                      </ns0:subscriber>
                      <ns0:portfolioType>revolving</ns0:portfolioType>
                      <ns0:accountNumber>5X9X5X9X0X1X1X9X</ns0:accountNumber>
                      <ns0:ECOADesignator>individual</ns0:ECOADesignator>
                      <ns0:dateOpened>01/25/2010</ns0:dateOpened>
                      <ns0:dateEffectiveLabel>DateUpdated</ns0:dateEffectiveLabel>
                      <ns0:dateEffective>07/27/2017</ns0:dateEffective>
                      <ns0:dateClosed>08/05/2015</ns0:dateClosed>
                      <ns0:highCredit>6730</ns0:highCredit>
                      <ns0:creditLimit>6500</ns0:creditLimit>
                      <ns0:accountRating>BK</ns0:accountRating>
                      <ns0:remark>
                         <ns0:code>BKL</ns0:code>
                         <ns0:type>affiliate</ns0:type>
                         <ns0:description>>INCLUDED IN BANKRUPTCY&lt;</ns0:description>
                      </ns0:remark>
                      <ns0:terms>
                         <ns0:description></ns0:description>
                      </ns0:terms>
                      <ns0:account>
                         <ns0:code>CC</ns0:code>
                         <ns0:description>CREDIT CARD</ns0:description>
                      </ns0:account>
                      <ns0:paymentHistory/>
                      <ns0:mostRecentPayment>
                         <ns0:date>07/23/2015</ns0:date>
                         <ns0:description></ns0:description>
                      </ns0:mostRecentPayment>
                      <ns0:additionalTradeAccount>
                         <ns0:original/>
                      </ns0:additionalTradeAccount>
                      <ns0:suppressionFlag>false</ns0:suppressionFlag>
                      <ns0:adverseFlag>true</ns0:adverseFlag>
                      <ns0:estimatedDeletionDate>04/2022</ns0:estimatedDeletionDate>
                      <ns0:accountRatingDescription>>Account Included in Bankruptcy&lt;</ns0:accountRatingDescription>
                      <ns0:portfolioTypeDescription>Revolving Account</ns0:portfolioTypeDescription>
                      <ns0:ECOADesignatorDescription>Individual Account</ns0:ECOADesignatorDescription>
                      <ns0:histPaymentDueList></ns0:histPaymentDueList>
                      <ns0:histPaymentAmtList></ns0:histPaymentAmtList>
                      <ns0:histBalanceList></ns0:histBalanceList>
                      <ns0:histPastDueList></ns0:histPastDueList>
                      <ns0:histRemarkList></ns0:histRemarkList>
                      <ns0:isCollection>false</ns0:isCollection>
                   </ns0:trade>
                   <ns0:trade>
                      <ns0:itemKey>6X1X0X7X0X0X5X6X_9616003_R</ns0:itemKey>
                      <ns0:subscriber>
                         <ns0:industryCode>BC</ns0:industryCode>
                         <ns0:memberCode>9616003</ns0:memberCode>
                         <ns0:name>
                            <ns0:unparsed>DISCOVER FINCL SVC LLC</ns0:unparsed>
                         </ns0:name>
                         <ns0:address>
                            <ns0:street>
                               <ns0:unparsed>1072 SW 101 St</ns0:unparsed>
                               <ns0:unparsed>Test 68</ns0:unparsed>
                            </ns0:street>
                            <ns0:location>
                               <ns0:unparsed>WILMINGTON, DE 19850-5316</ns0:unparsed>
                               <ns0:city>WILMINGTON</ns0:city>
                               <ns0:state>DE</ns0:state>
                               <ns0:zipCode>19850</ns0:zipCode>
                               <ns0:zipExt>5316</ns0:zipExt>
                            </ns0:location>
                         </ns0:address>
                         <ns0:phone>
                            <ns0:number>
                               <ns0:unparsed>(800) 347-2683</ns0:unparsed>
                               <ns0:areaCode>800</ns0:areaCode>
                               <ns0:exchange>347</ns0:exchange>
                               <ns0:suffix>2683</ns0:suffix>
                            </ns0:number>
                         </ns0:phone>
                      </ns0:subscriber>
                      <ns0:portfolioType>revolving</ns0:portfolioType>
                      <ns0:accountNumber>6X1X0X7X0X0X5X6X</ns0:accountNumber>
                      <ns0:ECOADesignator>individual</ns0:ECOADesignator>
                      <ns0:dateOpened>02/18/2011</ns0:dateOpened>
                      <ns0:dateEffectiveLabel>DateUpdated</ns0:dateEffectiveLabel>
                      <ns0:dateEffective>05/21/2017</ns0:dateEffective>
                      <ns0:dateClosed>04/04/2015</ns0:dateClosed>
                      <ns0:currentBalance>0</ns0:currentBalance>
                      <ns0:highCredit>3944</ns0:highCredit>
                      <ns0:accountRating>BK</ns0:accountRating>
                      <ns0:remark>
                         <ns0:code>BKL</ns0:code>
                         <ns0:type>affiliate</ns0:type>
                         <ns0:description>>INCLUDED IN BANKRUPTCY&lt;</ns0:description>
                      </ns0:remark>
                      <ns0:terms>
                         <ns0:description></ns0:description>
                      </ns0:terms>
                      <ns0:account>
                         <ns0:code>CC</ns0:code>
                         <ns0:description>CREDIT CARD</ns0:description>
                      </ns0:account>
                      <ns0:paymentHistory/>
                      <ns0:mostRecentPayment>
                         <ns0:date>03/22/2015</ns0:date>
                         <ns0:description></ns0:description>
                      </ns0:mostRecentPayment>
                      <ns0:additionalTradeAccount>
                         <ns0:original/>
                      </ns0:additionalTradeAccount>
                      <ns0:suppressionFlag>false</ns0:suppressionFlag>
                      <ns0:adverseFlag>true</ns0:adverseFlag>
                      <ns0:estimatedDeletionDate>02/2020</ns0:estimatedDeletionDate>
                      <ns0:accountRatingDescription>>Account Included in Bankruptcy&lt;</ns0:accountRatingDescription>
                      <ns0:portfolioTypeDescription>Revolving Account</ns0:portfolioTypeDescription>
                      <ns0:ECOADesignatorDescription>Individual Account</ns0:ECOADesignatorDescription>
                      <ns0:histPaymentDueList></ns0:histPaymentDueList>
                      <ns0:histPaymentAmtList></ns0:histPaymentAmtList>
                      <ns0:histBalanceList></ns0:histBalanceList>
                      <ns0:histPastDueList></ns0:histPastDueList>
                      <ns0:histRemarkList></ns0:histRemarkList>
                      <ns0:isCollection>false</ns0:isCollection>
                   </ns0:trade>
                   <ns0:trade>
                      <ns0:itemKey>4X0X0X9X8X6X7X6X_3429001_R</ns0:itemKey>
                      <ns0:subscriber>
                         <ns0:industryCode>BC</ns0:industryCode>
                         <ns0:memberCode>3429001</ns0:memberCode>
                         <ns0:name>
                            <ns0:unparsed>FIRST USA BANK</ns0:unparsed>
                         </ns0:name>
                         <ns0:address>
                            <ns0:street>
                               <ns0:unparsed>2500 WESTFIELD DR</ns0:unparsed>
                            </ns0:street>
                            <ns0:location>
                               <ns0:unparsed>ELGIN, IL 60124</ns0:unparsed>
                               <ns0:city>ELGIN</ns0:city>
                               <ns0:state>IL</ns0:state>
                               <ns0:zipCode>60124</ns0:zipCode>
                            </ns0:location>
                         </ns0:address>
                         <ns0:phone>
                            <ns0:number>
                               <ns0:unparsed>(800) 283-1211</ns0:unparsed>
                               <ns0:areaCode>800</ns0:areaCode>
                               <ns0:exchange>283</ns0:exchange>
                               <ns0:suffix>1211</ns0:suffix>
                            </ns0:number>
                         </ns0:phone>
                      </ns0:subscriber>
                      <ns0:portfolioType>revolving</ns0:portfolioType>
                      <ns0:accountNumber>4X0X0X9X8X6X7X6X</ns0:accountNumber>
                      <ns0:ECOADesignator>individual</ns0:ECOADesignator>
                      <ns0:dateOpened>10/11/2013</ns0:dateOpened>
                      <ns0:dateEffectiveLabel>DateUpdated</ns0:dateEffectiveLabel>
                      <ns0:dateEffective>07/26/2017</ns0:dateEffective>
                      <ns0:dateClosed>11/18/2013</ns0:dateClosed>
                      <ns0:highCredit>5551</ns0:highCredit>
                      <ns0:creditLimit>5400</ns0:creditLimit>
                      <ns0:accountRating>BK</ns0:accountRating>
                      <ns0:remark>
                         <ns0:code>BKL</ns0:code>
                         <ns0:type>affiliate</ns0:type>
                         <ns0:description>>INCLUDED IN BANKRUPTCY&lt;</ns0:description>
                      </ns0:remark>
                      <ns0:terms>
                         <ns0:description></ns0:description>
                      </ns0:terms>
                      <ns0:paymentHistory/>
                      <ns0:mostRecentPayment>
                         <ns0:description></ns0:description>
                      </ns0:mostRecentPayment>
                      <ns0:additionalTradeAccount>
                         <ns0:original/>
                      </ns0:additionalTradeAccount>
                      <ns0:suppressionFlag>false</ns0:suppressionFlag>
                      <ns0:adverseFlag>true</ns0:adverseFlag>
                      <ns0:estimatedDeletionDate>07/2020</ns0:estimatedDeletionDate>
                      <ns0:accountRatingDescription>>Account Included in Bankruptcy&lt;</ns0:accountRatingDescription>
                      <ns0:portfolioTypeDescription>Revolving Account</ns0:portfolioTypeDescription>
                      <ns0:ECOADesignatorDescription>Individual Account</ns0:ECOADesignatorDescription>
                      <ns0:histPaymentDueList></ns0:histPaymentDueList>
                      <ns0:histPaymentAmtList></ns0:histPaymentAmtList>
                      <ns0:histBalanceList></ns0:histBalanceList>
                      <ns0:histPastDueList></ns0:histPastDueList>
                      <ns0:histRemarkList></ns0:histRemarkList>
                      <ns0:isCollection>false</ns0:isCollection>
                   </ns0:trade>
                   <ns0:trade>
                      <ns0:itemKey>5X2X1X0X6X6X5X3X_64DB002_R</ns0:itemKey>
                      <ns0:subscriber>
                         <ns0:industryCode>BC</ns0:industryCode>
                         <ns0:memberCode>64DB002</ns0:memberCode>
                         <ns0:name>
                            <ns0:unparsed>ITT FIN</ns0:unparsed>
                         </ns0:name>
                         <ns0:address>
                            <ns0:street>
                               <ns0:unparsed>PO BOX 6241</ns0:unparsed>
                            </ns0:street>
                            <ns0:location>
                               <ns0:unparsed>SOUIX FALLS, SD 57117</ns0:unparsed>
                               <ns0:city>SOUIX FALLS</ns0:city>
                               <ns0:state>SD</ns0:state>
                               <ns0:zipCode>57117</ns0:zipCode>
                            </ns0:location>
                         </ns0:address>
                         <ns0:phone>
                            <ns0:number>
                               <ns0:unparsed>Phone number not available</ns0:unparsed>
                            </ns0:number>
                         </ns0:phone>
                      </ns0:subscriber>
                      <ns0:portfolioType>revolving</ns0:portfolioType>
                      <ns0:accountNumber>5X2X1X0X6X6X5X3X</ns0:accountNumber>
                      <ns0:ECOADesignator>individual</ns0:ECOADesignator>
                      <ns0:dateOpened>07/12/2005</ns0:dateOpened>
                      <ns0:dateEffectiveLabel>DateUpdated</ns0:dateEffectiveLabel>
                      <ns0:dateEffective>11/07/2011</ns0:dateEffective>
                      <ns0:datePaidOut>06/27/2011</ns0:datePaidOut>
                      <ns0:currentBalance>0</ns0:currentBalance>
                      <ns0:highCredit>2100</ns0:highCredit>
                      <ns0:creditLimit>2100</ns0:creditLimit>
                      <ns0:accountRating>01</ns0:accountRating>
                      <ns0:remark>
                         <ns0:code>CBC</ns0:code>
                         <ns0:type>compliance</ns0:type>
                         <ns0:description>ACCOUNT CLOSED BY CONSUMER</ns0:description>
                      </ns0:remark>
                      <ns0:terms>
                         <ns0:description></ns0:description>
                      </ns0:terms>
                      <ns0:account>
                         <ns0:code>CC</ns0:code>
                         <ns0:description>CREDIT CARD</ns0:description>
                      </ns0:account>
                      <ns0:paymentHistory>
                         <ns0:paymentPattern>
                            <ns0:startDate>10/01/2011</ns0:startDate>
                            <ns0:text>1111111111</ns0:text>
                         </ns0:paymentPattern>
                         <ns0:historicalCounters>
                            <ns0:monthsReviewedCount>10</ns0:monthsReviewedCount>
                            <ns0:late30DaysTotal>0</ns0:late30DaysTotal>
                            <ns0:late60DaysTotal>0</ns0:late60DaysTotal>
                            <ns0:late90DaysTotal>0</ns0:late90DaysTotal>
                         </ns0:historicalCounters>
                      </ns0:paymentHistory>
                      <ns0:mostRecentPayment>
                         <ns0:date>06/25/2011</ns0:date>
                         <ns0:description></ns0:description>
                      </ns0:mostRecentPayment>
                      <ns0:additionalTradeAccount>
                         <ns0:original/>
                      </ns0:additionalTradeAccount>
                      <ns0:suppressionFlag>false</ns0:suppressionFlag>
                      <ns0:adverseFlag>false</ns0:adverseFlag>
                      <ns0:accountRatingDescription>Current; Paid or Paying as Agreed</ns0:accountRatingDescription>
                      <ns0:portfolioTypeDescription>Revolving Account</ns0:portfolioTypeDescription>
                      <ns0:ECOADesignatorDescription>Individual Account</ns0:ECOADesignatorDescription>
                      <ns0:histPaymentDueList></ns0:histPaymentDueList>
                      <ns0:histPaymentAmtList></ns0:histPaymentAmtList>
                      <ns0:histBalanceList></ns0:histBalanceList>
                      <ns0:histPastDueList></ns0:histPastDueList>
                      <ns0:isCollection>false</ns0:isCollection>
                   </ns0:trade>
                   <ns0:trade>
                      <ns0:itemKey>0X5X1X0X0X8_235007R_R</ns0:itemKey>
                      <ns0:subscriber>
                         <ns0:industryCode>DZ</ns0:industryCode>
                         <ns0:memberCode>235007R</ns0:memberCode>
                         <ns0:name>
                            <ns0:unparsed>M.WARD/MBGA</ns0:unparsed>
                         </ns0:name>
                         <ns0:address>
                            <ns0:street>
                               <ns0:unparsed>PO BOX 29114</ns0:unparsed>
                            </ns0:street>
                            <ns0:location>
                               <ns0:unparsed>LENEXA, KS 66215</ns0:unparsed>
                               <ns0:city>LENEXA</ns0:city>
                               <ns0:state>KS</ns0:state>
                               <ns0:zipCode>66215</ns0:zipCode>
                            </ns0:location>
                         </ns0:address>
                         <ns0:phone>
                            <ns0:number>
                               <ns0:unparsed>Phone number not available</ns0:unparsed>
                            </ns0:number>
                         </ns0:phone>
                      </ns0:subscriber>
                      <ns0:portfolioType>revolving</ns0:portfolioType>
                      <ns0:accountNumber>0X5X1X0X0X8</ns0:accountNumber>
                      <ns0:ECOADesignator>individual</ns0:ECOADesignator>
                      <ns0:dateOpened>05/10/2012</ns0:dateOpened>
                      <ns0:dateEffectiveLabel>DateUpdated</ns0:dateEffectiveLabel>
                      <ns0:dateEffective>11/06/2014</ns0:dateEffective>
                      <ns0:currentBalance>0</ns0:currentBalance>
                      <ns0:highCredit>0</ns0:highCredit>
                      <ns0:creditLimit>1700</ns0:creditLimit>
                      <ns0:accountRating>01</ns0:accountRating>
                      <ns0:terms>
                         <ns0:description></ns0:description>
                      </ns0:terms>
                      <ns0:paymentHistory>
                         <ns0:paymentPattern>
                            <ns0:startDate>10/01/2014</ns0:startDate>
                            <ns0:text>111111111111XXXXXXXXXXXXXX1</ns0:text>
                         </ns0:paymentPattern>
                         <ns0:historicalCounters>
                            <ns0:monthsReviewedCount>27</ns0:monthsReviewedCount>
                            <ns0:late30DaysTotal>0</ns0:late30DaysTotal>
                            <ns0:late60DaysTotal>0</ns0:late60DaysTotal>
                            <ns0:late90DaysTotal>0</ns0:late90DaysTotal>
                         </ns0:historicalCounters>
                      </ns0:paymentHistory>
                      <ns0:mostRecentPayment>
                         <ns0:description></ns0:description>
                      </ns0:mostRecentPayment>
                      <ns0:additionalTradeAccount>
                         <ns0:original/>
                      </ns0:additionalTradeAccount>
                      <ns0:suppressionFlag>false</ns0:suppressionFlag>
                      <ns0:adverseFlag>false</ns0:adverseFlag>
                      <ns0:accountRatingDescription>Current; Paid or Paying as Agreed</ns0:accountRatingDescription>
                      <ns0:portfolioTypeDescription>Revolving Account</ns0:portfolioTypeDescription>
                      <ns0:ECOADesignatorDescription>Individual Account</ns0:ECOADesignatorDescription>
                      <ns0:histPaymentDueList></ns0:histPaymentDueList>
                      <ns0:histPaymentAmtList></ns0:histPaymentAmtList>
                      <ns0:histBalanceList></ns0:histBalanceList>
                      <ns0:histPastDueList></ns0:histPastDueList>
                      <ns0:histRemarkList></ns0:histRemarkList>
                      <ns0:isCollection>false</ns0:isCollection>
                   </ns0:trade>
                   <ns0:trade>
                      <ns0:itemKey>1X2X1X5X0X0X_6256385_R</ns0:itemKey>
                      <ns0:subscriber>
                         <ns0:industryCode>DC</ns0:industryCode>
                         <ns0:memberCode>6256385</ns0:memberCode>
                         <ns0:name>
                            <ns0:unparsed>SEARS ROEBUCK &amp; CO</ns0:unparsed>
                         </ns0:name>
                         <ns0:address>
                            <ns0:street>
                               <ns0:unparsed>13200 SMITH ROAD</ns0:unparsed>
                            </ns0:street>
                            <ns0:location>
                               <ns0:unparsed>CLEVELAND, OH 44130-6282</ns0:unparsed>
                               <ns0:city>CLEVELAND</ns0:city>
                               <ns0:state>OH</ns0:state>
                               <ns0:zipCode>44130</ns0:zipCode>
                               <ns0:zipExt>6282</ns0:zipExt>
                            </ns0:location>
                         </ns0:address>
                         <ns0:phone>
                            <ns0:number>
                               <ns0:unparsed>(800) 326-0115</ns0:unparsed>
                               <ns0:areaCode>800</ns0:areaCode>
                               <ns0:exchange>326</ns0:exchange>
                               <ns0:suffix>0115</ns0:suffix>
                            </ns0:number>
                         </ns0:phone>
                      </ns0:subscriber>
                      <ns0:portfolioType>revolving</ns0:portfolioType>
                      <ns0:accountNumber>1X2X1X5X0X0X</ns0:accountNumber>
                      <ns0:ECOADesignator>individual</ns0:ECOADesignator>
                      <ns0:dateOpened>06/17/2011</ns0:dateOpened>
                      <ns0:dateEffectiveLabel>DateUpdated</ns0:dateEffectiveLabel>
                      <ns0:dateEffective>01/14/2012</ns0:dateEffective>
                      <ns0:datePaidOut>10/15/2011</ns0:datePaidOut>
                      <ns0:currentBalance>0</ns0:currentBalance>
                      <ns0:highCredit>10</ns0:highCredit>
                      <ns0:creditLimit>2200</ns0:creditLimit>
                      <ns0:accountRating>01</ns0:accountRating>
                      <ns0:terms>
                         <ns0:description></ns0:description>
                      </ns0:terms>
                      <ns0:paymentHistory>
                         <ns0:paymentPattern>
                            <ns0:startDate>12/01/2011</ns0:startDate>
                            <ns0:text>1</ns0:text>
                         </ns0:paymentPattern>
                         <ns0:historicalCounters>
                            <ns0:monthsReviewedCount>1</ns0:monthsReviewedCount>
                            <ns0:late30DaysTotal>0</ns0:late30DaysTotal>
                            <ns0:late60DaysTotal>0</ns0:late60DaysTotal>
                            <ns0:late90DaysTotal>0</ns0:late90DaysTotal>
                         </ns0:historicalCounters>
                      </ns0:paymentHistory>
                      <ns0:mostRecentPayment>
                         <ns0:description></ns0:description>
                      </ns0:mostRecentPayment>
                      <ns0:additionalTradeAccount>
                         <ns0:original/>
                      </ns0:additionalTradeAccount>
                      <ns0:suppressionFlag>false</ns0:suppressionFlag>
                      <ns0:adverseFlag>false</ns0:adverseFlag>
                      <ns0:accountRatingDescription>Current; Paid or Paying as Agreed</ns0:accountRatingDescription>
                      <ns0:portfolioTypeDescription>Revolving Account</ns0:portfolioTypeDescription>
                      <ns0:ECOADesignatorDescription>Individual Account</ns0:ECOADesignatorDescription>
                      <ns0:histPaymentDueList></ns0:histPaymentDueList>
                      <ns0:histPaymentAmtList></ns0:histPaymentAmtList>
                      <ns0:histBalanceList></ns0:histBalanceList>
                      <ns0:histPastDueList></ns0:histPastDueList>
                      <ns0:histRemarkList></ns0:histRemarkList>
                      <ns0:isCollection>false</ns0:isCollection>
                   </ns0:trade>
                   <ns0:trade>
                      <ns0:itemKey>5X7X6X2X6X0X_930N133_R</ns0:itemKey>
                      <ns0:subscriber>
                         <ns0:industryCode>FF</ns0:industryCode>
                         <ns0:memberCode>930N133</ns0:memberCode>
                         <ns0:name>
                            <ns0:unparsed>TRANSAMERICA BANK</ns0:unparsed>
                         </ns0:name>
                         <ns0:address>
                            <ns0:street>
                               <ns0:unparsed>POB 130</ns0:unparsed>
                            </ns0:street>
                            <ns0:location>
                               <ns0:unparsed>CRYSTAL LAKE, IL 60139</ns0:unparsed>
                               <ns0:city>CRYSTAL LAKE</ns0:city>
                               <ns0:state>IL</ns0:state>
                               <ns0:zipCode>60139</ns0:zipCode>
                            </ns0:location>
                         </ns0:address>
                         <ns0:phone>
                            <ns0:number>
                               <ns0:unparsed>Phone number not available</ns0:unparsed>
                            </ns0:number>
                         </ns0:phone>
                      </ns0:subscriber>
                      <ns0:portfolioType>revolving</ns0:portfolioType>
                      <ns0:accountNumber>5X7X6X2X6X0X</ns0:accountNumber>
                      <ns0:ECOADesignator>individual</ns0:ECOADesignator>
                      <ns0:dateOpened>03/03/2012</ns0:dateOpened>
                      <ns0:dateEffectiveLabel>DateUpdated</ns0:dateEffectiveLabel>
                      <ns0:dateEffective>01/13/2017</ns0:dateEffective>
                      <ns0:dateClosed>08/03/2015</ns0:dateClosed>
                      <ns0:highCredit>1056</ns0:highCredit>
                      <ns0:creditLimit>3500</ns0:creditLimit>
                      <ns0:accountRating>BK</ns0:accountRating>
                      <ns0:remark>
                         <ns0:code>BKL</ns0:code>
                         <ns0:type>affiliate</ns0:type>
                         <ns0:description>>INCLUDED IN BANKRUPTCY&lt;</ns0:description>
                      </ns0:remark>
                      <ns0:terms>
                         <ns0:description></ns0:description>
                      </ns0:terms>
                      <ns0:account>
                         <ns0:code>CH</ns0:code>
                         <ns0:description>CHARGE ACCOUNT</ns0:description>
                      </ns0:account>
                      <ns0:paymentHistory/>
                      <ns0:mostRecentPayment>
                         <ns0:date>12/11/2016</ns0:date>
                         <ns0:description></ns0:description>
                      </ns0:mostRecentPayment>
                      <ns0:additionalTradeAccount>
                         <ns0:original/>
                      </ns0:additionalTradeAccount>
                      <ns0:suppressionFlag>false</ns0:suppressionFlag>
                      <ns0:adverseFlag>true</ns0:adverseFlag>
                      <ns0:estimatedDeletionDate>06/2022</ns0:estimatedDeletionDate>
                      <ns0:accountRatingDescription>>Account Included in Bankruptcy&lt;</ns0:accountRatingDescription>
                      <ns0:portfolioTypeDescription>Revolving Account</ns0:portfolioTypeDescription>
                      <ns0:ECOADesignatorDescription>Individual Account</ns0:ECOADesignatorDescription>
                      <ns0:histPaymentDueList></ns0:histPaymentDueList>
                      <ns0:histPaymentAmtList></ns0:histPaymentAmtList>
                      <ns0:histBalanceList></ns0:histBalanceList>
                      <ns0:histPastDueList></ns0:histPastDueList>
                      <ns0:histRemarkList></ns0:histRemarkList>
                      <ns0:isCollection>false</ns0:isCollection>
                   </ns0:trade>
                   <ns0:trade>
                      <ns0:itemKey>4X1X1X0X1X2X2X7X_3763001_R</ns0:itemKey>
                      <ns0:subscriber>
                         <ns0:industryCode>BC</ns0:industryCode>
                         <ns0:memberCode>3763001</ns0:memberCode>
                         <ns0:name>
                            <ns0:unparsed>WACHOVIA-BANKCARD</ns0:unparsed>
                         </ns0:name>
                         <ns0:address>
                            <ns0:street>
                               <ns0:unparsed>PO BOX 3117</ns0:unparsed>
                            </ns0:street>
                            <ns0:location>
                               <ns0:unparsed>WINSTON-SALEM, NC 27102</ns0:unparsed>
                               <ns0:city>WINSTON-SALEM</ns0:city>
                               <ns0:state>NC</ns0:state>
                               <ns0:zipCode>27102</ns0:zipCode>
                            </ns0:location>
                         </ns0:address>
                         <ns0:phone>
                            <ns0:number>
                               <ns0:unparsed>Phone number not available</ns0:unparsed>
                            </ns0:number>
                         </ns0:phone>
                      </ns0:subscriber>
                      <ns0:portfolioType>revolving</ns0:portfolioType>
                      <ns0:accountNumber>4X1X1X0X1X2X2X7X</ns0:accountNumber>
                      <ns0:ECOADesignator>individual</ns0:ECOADesignator>
                      <ns0:dateOpened>10/10/2013</ns0:dateOpened>
                      <ns0:dateEffectiveLabel>DateUpdated</ns0:dateEffectiveLabel>
                      <ns0:dateEffective>09/19/2017</ns0:dateEffective>
                      <ns0:dateClosed>08/02/2015</ns0:dateClosed>
                      <ns0:highCredit>0</ns0:highCredit>
                      <ns0:accountRating>BK</ns0:accountRating>
                      <ns0:remark>
                         <ns0:code>CBL</ns0:code>
                         <ns0:type>affiliate</ns0:type>
                         <ns0:description>>CHAPTER 7 BANKRUPTCY&lt;</ns0:description>
                      </ns0:remark>
                      <ns0:terms>
                         <ns0:description></ns0:description>
                      </ns0:terms>
                      <ns0:account>
                         <ns0:code>CC</ns0:code>
                         <ns0:description>CREDIT CARD</ns0:description>
                      </ns0:account>
                      <ns0:paymentHistory/>
                      <ns0:mostRecentPayment>
                         <ns0:date>07/20/2015</ns0:date>
                         <ns0:description></ns0:description>
                      </ns0:mostRecentPayment>
                      <ns0:additionalTradeAccount>
                         <ns0:original/>
                      </ns0:additionalTradeAccount>
                      <ns0:suppressionFlag>false</ns0:suppressionFlag>
                      <ns0:adverseFlag>true</ns0:adverseFlag>
                      <ns0:estimatedDeletionDate>10/2022</ns0:estimatedDeletionDate>
                      <ns0:accountRatingDescription>>Account Included in Bankruptcy&lt;</ns0:accountRatingDescription>
                      <ns0:portfolioTypeDescription>Revolving Account</ns0:portfolioTypeDescription>
                      <ns0:ECOADesignatorDescription>Individual Account</ns0:ECOADesignatorDescription>
                      <ns0:histPaymentDueList></ns0:histPaymentDueList>
                      <ns0:histPaymentAmtList></ns0:histPaymentAmtList>
                      <ns0:histBalanceList></ns0:histBalanceList>
                      <ns0:histPastDueList></ns0:histPastDueList>
                      <ns0:histRemarkList></ns0:histRemarkList>
                      <ns0:isCollection>false</ns0:isCollection>
                   </ns0:trade>
                   <ns0:publicRecord>
                      <ns0:itemKey>9X4X6X3_4871356_7X</ns0:itemKey>
                      <ns0:type>7X</ns0:type>
                      <ns0:subscriber>
                         <ns0:industryCode>ZP</ns0:industryCode>
                         <ns0:memberCode>4871356</ns0:memberCode>
                         <ns0:subscriberType>reporting</ns0:subscriberType>
                         <ns0:name>
                            <ns0:unparsed>MINNESOTA FEDERAL COURT-</ns0:unparsed>
                         </ns0:name>
                         <ns0:address>
                            <ns0:street>
                               <ns0:unparsed>300 S 4TH STREET</ns0:unparsed>
                            </ns0:street>
                            <ns0:location>
                               <ns0:unparsed>MINNEAPOLIS, MN 55415</ns0:unparsed>
                               <ns0:city>MINNEAPOLIS</ns0:city>
                               <ns0:state>MN</ns0:state>
                               <ns0:zipCode>55415</ns0:zipCode>
                            </ns0:location>
                         </ns0:address>
                         <ns0:phone>
                            <ns0:number>
                               <ns0:unparsed>(612) 664-5200</ns0:unparsed>
                               <ns0:areaCode>612</ns0:areaCode>
                               <ns0:exchange>664</ns0:exchange>
                               <ns0:suffix>5200</ns0:suffix>
                            </ns0:number>
                         </ns0:phone>
                      </ns0:subscriber>
                      <ns0:docketNumber>9X4X6X3</ns0:docketNumber>
                      <ns0:attorney>JACK L PRESCOTT</ns0:attorney>
                      <ns0:plaintiff></ns0:plaintiff>
                      <ns0:dateEffective>10/13/2015</ns0:dateEffective>
                      <ns0:dateFiled>10/13/2015</ns0:dateFiled>
                      <ns0:datePaid>01/25/2016</ns0:datePaid>
                      <ns0:ECOADesignator>individual</ns0:ECOADesignator>
                      <ns0:source>
                         <ns0:code>FE</ns0:code>
                         <ns0:description>Federal District</ns0:description>
                      </ns0:source>
                      <ns0:estimatedDateOfDeletion>09/2025</ns0:estimatedDateOfDeletion>
                      <ns0:suppressionIndicator>false</ns0:suppressionIndicator>
                      <ns0:publicRecordTypeDescription>CHAPTER 7 BANKRUPTCY DISCHARGED</ns0:publicRecordTypeDescription>
                      <ns0:ECOADescription>Individual Debt</ns0:ECOADescription>
                      <ns0:dateEffectiveLabel>DateUpdated</ns0:dateEffectiveLabel>
                      <ns0:order>1</ns0:order>
                   </ns0:publicRecord>
                   <ns0:histRemarkLegend></ns0:histRemarkLegend>
                </ns0:credit>
             </ns0:custom>
             <ns0:addOnProduct>
                <ns0:scoreModel>
                   <ns0:score>
                      <ns0:name>
                         <ns0:person>
                            <ns0:unparsed>DORA G. JULIEN</ns0:unparsed>
                            <ns0:first>DORA</ns0:first>
                            <ns0:middle>G</ns0:middle>
                            <ns0:last>JULIEN</ns0:last>
                            <ns0:order>1</ns0:order>
                         </ns0:person>
                      </ns0:name>
                      <ns0:productCode>00W40</ns0:productCode>
                      <ns0:score>11</ns0:score>
                      <ns0:scoreGrade>-</ns0:scoreGrade>
                      <ns0:scoreDate>03/09/2018</ns0:scoreDate>
                      <ns0:quantitativeGraphNumber>-1</ns0:quantitativeGraphNumber>
                      <ns0:populationGraphNumber>50</ns0:populationGraphNumber>
                      <ns0:populationDescription>Your credit ranks higher than --% of the nation's population.</ns0:populationDescription>
                      <ns0:summaryDescription>You did not order a TransUnion credit score. You can purchase your credit score for $9.95 by calling 1-866-SCORE-TU or 1-866-726-7388.</ns0:summaryDescription>
                   </ns0:score>
                </ns0:scoreModel>
                <ns0:militaryLendingActSearch ns0:searchStatus="noMatch"/>
             </ns0:addOnProduct>
             <ns0:closingInfo>
                <ns0:mail>
                   <ns0:unparsed>TransUnion Consumer Relations</ns0:unparsed>
                </ns0:mail>
                <ns0:address>
                   <ns0:street>
                      <ns0:unparsed>P.O. Box 2000</ns0:unparsed>
                   </ns0:street>
                   <ns0:location>
                      <ns0:unparsed>Chester, PA 19016-2000</ns0:unparsed>
                   </ns0:location>
                   <ns0:order>1</ns0:order>
                </ns0:address>
                <ns0:phone>
                   <ns0:number>
                      <ns0:unparsed>(800) 916-8800</ns0:unparsed>
                   </ns0:number>
                </ns0:phone>
                <ns0:contactURL>www.transunion.com</ns0:contactURL>
                <ns0:disputeURL>www.transunion.com/disputeonline</ns0:disputeURL>
             </ns0:closingInfo>
             <ns0:fileNumber>300010987</ns0:fileNumber>
             <ns0:consumerID>1078425505</ns0:consumerID>
             <ns0:fileDate>03/09/2018</ns0:fileDate>
             <ns0:dynamicText>
                <ns0:personalInfoDetail>
                   <ns0:type>1</ns0:type>
                   <ns0:text>Your SSN has been masked for your protection.</ns0:text>
                </ns0:personalInfoDetail>
                <ns0:publicRecordDetail>
                   <ns0:type>2</ns0:type>
                   <ns0:text>You may be required to explain these items to potential creditors. Generally, this information was collected from public record sources by TransUnion or a company we hired to collect such information. If you submit a dispute of the accuracy of a public record item, TransUnion may update the item based on the information you provide, or we may investigate your dispute by checking with the public record source or by asking our vendor to verify that the current status of the public record is reported accurately.</ns0:text>
                </ns0:publicRecordDetail>
                <ns0:publicRecordDetail>
                   <ns0:type>2</ns0:type>
                   <ns0:text>Discharged Chapter 7 bankruptcy remains on your file for up to 10 years.</ns0:text>
                </ns0:publicRecordDetail>
                <ns0:adverseAcctDetail>
                   <ns0:type>2</ns0:type>
                   <ns0:text>Adverse information typically remains on your credit file for up to 7 years from the date of the delinquency. To help you understand what is generally considered adverse, we have added >brackets&lt; to those items in this report.</ns0:text>
                </ns0:adverseAcctDetail>
                <ns0:adverseAcctDetail>
                   <ns0:type>1</ns0:type>
                   <ns0:text>For your protection, your account numbers have been partially masked, and in some cases scrambled.</ns0:text>
                </ns0:adverseAcctDetail>
                <ns0:accountDetail>
                   <ns0:type>2</ns0:type>
                   <ns0:text></ns0:text>
                </ns0:accountDetail>
                <ns0:accountDetail>
                   <ns0:text>The following accounts are reported with no adverse information. For your protection, your account numbers have been partially masked, and in some cases scrambled.</ns0:text>
                </ns0:accountDetail>
                <ns0:accountDetail>
                   <ns0:text>Please note: Accounts are reported as &quot;Current; Paid or paying as agreed&quot; if paid within 30 days of the due date. Accounts reported as Current may still incur late fees or interest charges if not paid on or before the due date.</ns0:text>
                </ns0:accountDetail>
             </ns0:dynamicText>
          </ns0:subjectRecord>
          <ns0:fullDisclFlag>N</ns0:fullDisclFlag>
       </ns0:subject>
    </ns0:product>
 </ns0:productArray>
</ns0:creditBureau>]]></a:CreditBureau>
      <a:InvestigationResults><![CDATA[<?xml version="1.0" encoding="UTF-8"?>
<trueLinkCreditReportType xmlns:ns0="com/truelink/ds/sch/report/truelink/v4_1" FraudIndicator="false" DeceasedIndicator="false">
 <ns0:SB168Frozen equifax="false" experian="false" transunion="false"/>
 <ns0:Borrower SocialSecurityNumber="471-86-6871">
    <ns0:BorrowerAddress dateReported="2015-09-02-07:00" addressOrder="0" partitionSet="0">
       <ns0:CreditAddress city="BRAHAM" stateCode="MN" unparsedStreet="PO BOX 384" postalCode="550060384"/>
       <ns0:Dwelling abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Origin abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Ownership abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:BorrowerAddress>
    <ns0:CreditScore riskScore="11" scoreName="VantageScore3">
       <ns0:CreditScoreModel abbreviation="" description="" symbol="00W40" rank="100000"/>
       <ns0:NoScoreReason abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:CreditScore>
    <ns0:BorrowerName partitionSet="0">
       <ns0:Name first="DORA" middle="G" last="JULIEN"/>
       <ns0:NameType abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:BorrowerName>
    <ns0:SocialPartition>
       <ns0:Social>
          <ns0:SocialSecurityNumber>471-86-6871</ns0:SocialSecurityNumber>
          <ns0:Source>
             <ns0:BorrowerKey></ns0:BorrowerKey>
             <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
             <ns0:Reference></ns0:Reference>
          </ns0:Source>
       </ns0:Social>
    </ns0:SocialPartition>
 </ns0:Borrower>
 <ns0:TradeLinePartition accountTypeDescription="Revolving Account" accountTypeSymbol="R" accountTypeAbbreviation="Revolving">
    <ns0:Tradeline accountNumber="4X2X7X1X9X2X5X6X" creditorName="CARD PRODUCTS" currentBalance="0" dateAccountStatus="2015-09-26-07:00" dateClosed="2015-09-26-07:00" dateOpened="2013-06-16-07:00" highBalance="4930" subscriberCode="927P029" position="0" bureau="TransUnion" handle="TR01_156313180_532784485_82">
       <ns0:AccountCondition abbreviation="Derog" description="Derogatory" symbol="F" rank="20"/>
       <ns0:AccountDesignator abbreviation="Individual" description="Individual" symbol="I" rank="199"/>
       <ns0:DisputeFlag abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:IndustryCode abbreviation="Bank Collection" description="Bank Collection" symbol="BY" rank="199"/>
       <ns0:OpenClosed abbreviation="Open" description="Open" symbol="O" rank="199"/>
       <ns0:PayStatus abbreviation="Unk" description="Unknown" symbol="U" rank="10000"/>
       <ns0:VerificationIndicator abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Remark customRemark="">
          <ns0:RemarkCode abbreviation="Included in bankruptcy" description="Included in bankruptcy" symbol="T00BKL" rank="199"/>
       </ns0:Remark>
       <ns0:GrantedTrade amountPastDue="0" collateral="" dateLastPayment="2015-05-31-07:00" late30Count="0" late60Count="0" late90Count="0" monthlyPayment="0" monthsReviewed="0" termMonths="0" worstPatStatusCount="0">
          <ns0:AccountType abbreviation="Credit Card" description="Credit Card" symbol="CC" rank="50"/>
          <ns0:CreditType abbreviation="Revolving" description="Revolving Account" symbol="R" rank="50"/>
          <ns0:PaymentFrequency abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:TermType abbreviation="Provided" description="Provided" symbol="P" rank="199"/>
          <ns0:WorstPayStatus abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:PayStatusHistory/>
          <ns0:CreditLimit>0</ns0:CreditLimit>
       </ns0:GrantedTrade>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:Tradeline>
 </ns0:TradeLinePartition>
 <ns0:TradeLinePartition accountTypeDescription="Revolving Account" accountTypeSymbol="R" accountTypeAbbreviation="Revolving">
    <ns0:Tradeline accountNumber="4X2X1X0X2X0X5X0X" creditorName="CHASE NA" currentBalance="0" dateAccountStatus="2015-10-13-07:00" dateClosed="2015-08-01-07:00" dateOpened="2013-02-08-08:00" highBalance="4666" subscriberCode="402D013" position="1" bureau="TransUnion" handle="TR01_206301426_327999940_82">
       <ns0:AccountCondition abbreviation="Derog" description="Derogatory" symbol="F" rank="20"/>
       <ns0:AccountDesignator abbreviation="Individual" description="Individual" symbol="I" rank="199"/>
       <ns0:DisputeFlag abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:IndustryCode abbreviation="Bank Credit Cards" description="Bank Credit Cards" symbol="BC" rank="199"/>
       <ns0:OpenClosed abbreviation="Open" description="Open" symbol="O" rank="199"/>
       <ns0:PayStatus abbreviation="Unk" description="Unknown" symbol="U" rank="10000"/>
       <ns0:VerificationIndicator abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Remark customRemark="">
          <ns0:RemarkCode abbreviation="Chapter 7 bankruptcy" description="Chapter 7 bankruptcy" symbol="T00CBL" rank="199"/>
       </ns0:Remark>
       <ns0:GrantedTrade amountPastDue="0" collateral="" dateLastPayment="2015-07-19-07:00" late30Count="0" late60Count="0" late90Count="0" monthlyPayment="0" monthsReviewed="0" termMonths="0" worstPatStatusCount="0">
          <ns0:AccountType abbreviation="Unknown" description="Unknown" symbol="" rank="199"/>
          <ns0:CreditType abbreviation="Revolving" description="Revolving Account" symbol="R" rank="50"/>
          <ns0:PaymentFrequency abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:TermType abbreviation="Provided" description="Provided" symbol="P" rank="199"/>
          <ns0:WorstPayStatus abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:PayStatusHistory/>
          <ns0:CreditLimit>4600</ns0:CreditLimit>
       </ns0:GrantedTrade>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:Tradeline>
 </ns0:TradeLinePartition>
 <ns0:TradeLinePartition accountTypeDescription="Revolving Account" accountTypeSymbol="R" accountTypeAbbreviation="Revolving">
    <ns0:Tradeline accountNumber="5X9X5X9X0X1X1X9X" creditorName="CITIBANK UCS" currentBalance="0" dateAccountStatus="2015-08-05-07:00" dateClosed="2015-08-05-07:00" dateOpened="2010-01-25-08:00" highBalance="6730" subscriberCode="8194006" position="2" bureau="TransUnion" handle="TR01_37390393_-382335518_82">
       <ns0:AccountCondition abbreviation="Derog" description="Derogatory" symbol="F" rank="20"/>
       <ns0:AccountDesignator abbreviation="Individual" description="Individual" symbol="I" rank="199"/>
       <ns0:DisputeFlag abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:IndustryCode abbreviation="Bank Credit Cards" description="Bank Credit Cards" symbol="BC" rank="199"/>
       <ns0:OpenClosed abbreviation="Open" description="Open" symbol="O" rank="199"/>
       <ns0:PayStatus abbreviation="Unk" description="Unknown" symbol="U" rank="10000"/>
       <ns0:VerificationIndicator abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Remark customRemark="">
          <ns0:RemarkCode abbreviation="Included in bankruptcy" description="Included in bankruptcy" symbol="T00BKL" rank="199"/>
       </ns0:Remark>
       <ns0:GrantedTrade amountPastDue="0" collateral="" dateLastPayment="2015-07-23-07:00" late30Count="0" late60Count="0" late90Count="0" monthlyPayment="0" monthsReviewed="0" termMonths="0" worstPatStatusCount="0">
          <ns0:AccountType abbreviation="Credit Card" description="Credit Card" symbol="CC" rank="50"/>
          <ns0:CreditType abbreviation="Revolving" description="Revolving Account" symbol="R" rank="50"/>
          <ns0:PaymentFrequency abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:TermType abbreviation="Provided" description="Provided" symbol="P" rank="199"/>
          <ns0:WorstPayStatus abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:PayStatusHistory/>
          <ns0:CreditLimit>6500</ns0:CreditLimit>
       </ns0:GrantedTrade>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:Tradeline>
 </ns0:TradeLinePartition>
 <ns0:TradeLinePartition accountTypeDescription="Revolving Account" accountTypeSymbol="R" accountTypeAbbreviation="Revolving">
    <ns0:Tradeline accountNumber="6X1X0X7X0X0X5X6X" creditorName="DISCOVER FINCL SVC LLC" currentBalance="0" dateAccountStatus="2015-04-04-07:00" dateClosed="2015-04-04-07:00" dateOpened="2011-02-18-08:00" highBalance="3944" subscriberCode="9616003" position="3" bureau="TransUnion" handle="TR01_-1004538745_640985329_82">
       <ns0:AccountCondition abbreviation="Derog" description="Derogatory" symbol="F" rank="20"/>
       <ns0:AccountDesignator abbreviation="Individual" description="Individual" symbol="I" rank="199"/>
       <ns0:DisputeFlag abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:IndustryCode abbreviation="Bank Credit Cards" description="Bank Credit Cards" symbol="BC" rank="199"/>
       <ns0:OpenClosed abbreviation="Open" description="Open" symbol="O" rank="199"/>
       <ns0:PayStatus abbreviation="Unk" description="Unknown" symbol="U" rank="10000"/>
       <ns0:VerificationIndicator abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Remark customRemark="">
          <ns0:RemarkCode abbreviation="Included in bankruptcy" description="Included in bankruptcy" symbol="T00BKL" rank="199"/>
       </ns0:Remark>
       <ns0:GrantedTrade amountPastDue="0" collateral="" dateLastPayment="2015-03-22-07:00" late30Count="0" late60Count="0" late90Count="0" monthlyPayment="0" monthsReviewed="0" termMonths="0" worstPatStatusCount="0">
          <ns0:AccountType abbreviation="Credit Card" description="Credit Card" symbol="CC" rank="50"/>
          <ns0:CreditType abbreviation="Revolving" description="Revolving Account" symbol="R" rank="50"/>
          <ns0:PaymentFrequency abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:TermType abbreviation="Provided" description="Provided" symbol="P" rank="199"/>
          <ns0:WorstPayStatus abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:PayStatusHistory/>
          <ns0:CreditLimit>0</ns0:CreditLimit>
       </ns0:GrantedTrade>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:Tradeline>
 </ns0:TradeLinePartition>
 <ns0:TradeLinePartition accountTypeDescription="Revolving Account" accountTypeSymbol="R" accountTypeAbbreviation="Revolving">
    <ns0:Tradeline accountNumber="4X0X0X9X8X6X7X6X" creditorName="FIRST USA BANK" currentBalance="0" dateAccountStatus="2013-11-18-08:00" dateClosed="2013-11-18-08:00" dateOpened="2013-10-11-07:00" highBalance="5551" subscriberCode="3429001" position="4" bureau="TransUnion" handle="TR01_1358476504_-445314871_82">
       <ns0:AccountCondition abbreviation="Derog" description="Derogatory" symbol="F" rank="20"/>
       <ns0:AccountDesignator abbreviation="Individual" description="Individual" symbol="I" rank="199"/>
       <ns0:DisputeFlag abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:IndustryCode abbreviation="Bank Credit Cards" description="Bank Credit Cards" symbol="BC" rank="199"/>
       <ns0:OpenClosed abbreviation="Open" description="Open" symbol="O" rank="199"/>
       <ns0:PayStatus abbreviation="Unk" description="Unknown" symbol="U" rank="10000"/>
       <ns0:VerificationIndicator abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Remark customRemark="">
          <ns0:RemarkCode abbreviation="Included in bankruptcy" description="Included in bankruptcy" symbol="T00BKL" rank="199"/>
       </ns0:Remark>
       <ns0:GrantedTrade amountPastDue="0" collateral="" late30Count="0" late60Count="0" late90Count="0" monthlyPayment="0" monthsReviewed="0" termMonths="0" worstPatStatusCount="0">
          <ns0:AccountType abbreviation="Unknown" description="Unknown" symbol="" rank="199"/>
          <ns0:CreditType abbreviation="Revolving" description="Revolving Account" symbol="R" rank="50"/>
          <ns0:PaymentFrequency abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:TermType abbreviation="Provided" description="Provided" symbol="P" rank="199"/>
          <ns0:WorstPayStatus abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:PayStatusHistory/>
          <ns0:CreditLimit>5400</ns0:CreditLimit>
       </ns0:GrantedTrade>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:Tradeline>
 </ns0:TradeLinePartition>
 <ns0:TradeLinePartition accountTypeDescription="Revolving Account" accountTypeSymbol="R" accountTypeAbbreviation="Revolving">
    <ns0:Tradeline accountNumber="5X2X1X0X6X6X5X3X" creditorName="ITT FIN" currentBalance="0" dateAccountStatus="2011-06-27-07:00" dateOpened="2005-07-12-07:00" highBalance="2100" subscriberCode="64DB002" position="5" bureau="TransUnion" handle="TR01_-1751151004_-2060879626_82">
       <ns0:AccountCondition abbreviation="Closed" description="Closed" symbol="C" rank="50"/>
       <ns0:AccountDesignator abbreviation="Individual" description="Individual" symbol="I" rank="199"/>
       <ns0:DisputeFlag abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:IndustryCode abbreviation="Bank Credit Cards" description="Bank Credit Cards" symbol="BC" rank="199"/>
       <ns0:OpenClosed abbreviation="Closed" description="Closed" symbol="C" rank="198"/>
       <ns0:PayStatus abbreviation="Current" description="Current" symbol="C" rank="110"/>
       <ns0:VerificationIndicator abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Remark customRemark="">
          <ns0:RemarkCode abbreviation="Account closed by consumer" description="Account closed by consumer" symbol="T00CBC" rank="199"/>
       </ns0:Remark>
       <ns0:GrantedTrade amountPastDue="0" collateral="" dateLastPayment="2011-06-25-07:00" late30Count="0" late60Count="0" late90Count="0" monthlyPayment="0" monthsReviewed="10" termMonths="0" worstPatStatusCount="10">
          <ns0:AccountType abbreviation="Credit Card" description="Credit Card" symbol="CC" rank="50"/>
          <ns0:CreditType abbreviation="Revolving" description="Revolving Account" symbol="R" rank="50"/>
          <ns0:PaymentFrequency abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:TermType abbreviation="Provided" description="Provided" symbol="P" rank="199"/>
          <ns0:WorstPayStatus abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:PayStatusHistory status="" startDate="2011-10-01-07:00">
             <ns0:MonthlyPayStatus date="2011-10-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-09-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-08-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-07-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-06-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-05-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-04-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-03-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-02-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-01-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-12-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-11-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-10-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-09-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-08-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-07-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-06-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-05-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-04-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-03-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-02-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-01-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2009-12-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2009-11-01-07:00" status=" "/>
          </ns0:PayStatusHistory>
          <ns0:CreditLimit>2100</ns0:CreditLimit>
       </ns0:GrantedTrade>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:Tradeline>
 </ns0:TradeLinePartition>
 <ns0:TradeLinePartition accountTypeDescription="Revolving Account" accountTypeSymbol="R" accountTypeAbbreviation="Revolving">
    <ns0:Tradeline accountNumber="0X5X1X0X0X8" creditorName="M.WARD/MBGA" currentBalance="0" dateOpened="2012-05-10-07:00" highBalance="0" subscriberCode="235007R" position="6" bureau="TransUnion" handle="TR01_79414454_-1358945009_82">
       <ns0:AccountCondition abbreviation="Open" description="Open" symbol="O" rank="60"/>
       <ns0:AccountDesignator abbreviation="Individual" description="Individual" symbol="I" rank="199"/>
       <ns0:DisputeFlag abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:IndustryCode abbreviation="Miscellaneous Department &amp; Variety Stores" description="Miscellaneous Department &amp; Variety Stores" symbol="DZ" rank="199"/>
       <ns0:OpenClosed abbreviation="Open" description="Open" symbol="O" rank="199"/>
       <ns0:PayStatus abbreviation="Current" description="Current" symbol="C" rank="110"/>
       <ns0:VerificationIndicator abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:GrantedTrade amountPastDue="0" collateral="" late30Count="0" late60Count="0" late90Count="0" monthlyPayment="0" monthsReviewed="27" termMonths="0" worstPatStatusCount="27">
          <ns0:AccountType abbreviation="Unknown" description="Unknown" symbol="" rank="199"/>
          <ns0:CreditType abbreviation="Revolving" description="Revolving Account" symbol="R" rank="50"/>
          <ns0:PaymentFrequency abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:TermType abbreviation="Provided" description="Provided" symbol="P" rank="199"/>
          <ns0:WorstPayStatus abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:PayStatusHistory status="" startDate="2014-10-01-07:00">
             <ns0:MonthlyPayStatus date="2014-10-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2014-09-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2014-08-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2014-07-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2014-06-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2014-05-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2014-04-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2014-03-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2014-02-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2014-01-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2013-12-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2013-11-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2013-10-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2013-09-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2013-08-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2013-07-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2013-06-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2013-05-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2013-04-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2013-03-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2013-02-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2013-01-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2012-12-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2012-11-01-07:00" status=" "/>
          </ns0:PayStatusHistory>
          <ns0:CreditLimit>1700</ns0:CreditLimit>
       </ns0:GrantedTrade>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:Tradeline>
 </ns0:TradeLinePartition>
 <ns0:TradeLinePartition accountTypeDescription="Revolving Account" accountTypeSymbol="R" accountTypeAbbreviation="Revolving">
    <ns0:Tradeline accountNumber="1X2X1X5X0X0X" creditorName="SEARS ROEBUCK &amp; CO" currentBalance="0" dateAccountStatus="2011-10-15-07:00" dateOpened="2011-06-17-07:00" highBalance="10" subscriberCode="6256385" position="7" bureau="TransUnion" handle="TR01_-971350393_-2132345101_82">
       <ns0:AccountCondition abbreviation="Open" description="Open" symbol="O" rank="60"/>
       <ns0:AccountDesignator abbreviation="Individual" description="Individual" symbol="I" rank="199"/>
       <ns0:DisputeFlag abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:IndustryCode abbreviation="Complete Department Stores" description="Complete Department Stores" symbol="DC" rank="199"/>
       <ns0:OpenClosed abbreviation="Open" description="Open" symbol="O" rank="199"/>
       <ns0:PayStatus abbreviation="Current" description="Current" symbol="C" rank="110"/>
       <ns0:VerificationIndicator abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:GrantedTrade amountPastDue="0" collateral="" late30Count="0" late60Count="0" late90Count="0" monthlyPayment="0" monthsReviewed="1" termMonths="0" worstPatStatusCount="1">
          <ns0:AccountType abbreviation="Unknown" description="Unknown" symbol="" rank="199"/>
          <ns0:CreditType abbreviation="Revolving" description="Revolving Account" symbol="R" rank="50"/>
          <ns0:PaymentFrequency abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:TermType abbreviation="Provided" description="Provided" symbol="P" rank="199"/>
          <ns0:WorstPayStatus abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:PayStatusHistory status="" startDate="2011-12-01-08:00">
             <ns0:MonthlyPayStatus date="2011-12-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-11-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-10-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-09-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-08-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-07-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-06-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-05-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-04-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-03-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-02-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2011-01-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-12-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-11-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-10-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-09-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-08-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-07-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-06-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-05-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-04-01-07:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-03-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-02-01-08:00" status=" "/>
             <ns0:MonthlyPayStatus date="2010-01-01-08:00" status=" "/>
          </ns0:PayStatusHistory>
          <ns0:CreditLimit>2200</ns0:CreditLimit>
       </ns0:GrantedTrade>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:Tradeline>
 </ns0:TradeLinePartition>
 <ns0:TradeLinePartition accountTypeDescription="Revolving Account" accountTypeSymbol="R" accountTypeAbbreviation="Revolving">
    <ns0:Tradeline accountNumber="5X7X6X2X6X0X" creditorName="TRANSAMERICA BANK" currentBalance="0" dateAccountStatus="2015-08-03-07:00" dateClosed="2015-08-03-07:00" dateOpened="2012-03-03-08:00" highBalance="1056" subscriberCode="930N133" position="8" bureau="TransUnion" handle="TR01_-1399178666_554890393_82">
       <ns0:AccountCondition abbreviation="Derog" description="Derogatory" symbol="F" rank="20"/>
       <ns0:AccountDesignator abbreviation="Individual" description="Individual" symbol="I" rank="199"/>
       <ns0:DisputeFlag abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:IndustryCode abbreviation="Sales Financing Company" description="Sales Financing Company" symbol="FF" rank="199"/>
       <ns0:OpenClosed abbreviation="Open" description="Open" symbol="O" rank="199"/>
       <ns0:PayStatus abbreviation="Unk" description="Unknown" symbol="U" rank="10000"/>
       <ns0:VerificationIndicator abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Remark customRemark="">
          <ns0:RemarkCode abbreviation="Included in bankruptcy" description="Included in bankruptcy" symbol="T00BKL" rank="199"/>
       </ns0:Remark>
       <ns0:GrantedTrade amountPastDue="0" collateral="" dateLastPayment="2016-12-11-08:00" late30Count="0" late60Count="0" late90Count="0" monthlyPayment="0" monthsReviewed="0" termMonths="0" worstPatStatusCount="0">
          <ns0:AccountType abbreviation="Charge account" description="Charge account" symbol="CH" rank="50"/>
          <ns0:CreditType abbreviation="Revolving" description="Revolving Account" symbol="R" rank="50"/>
          <ns0:PaymentFrequency abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:TermType abbreviation="Provided" description="Provided" symbol="P" rank="199"/>
          <ns0:WorstPayStatus abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:PayStatusHistory/>
          <ns0:CreditLimit>3500</ns0:CreditLimit>
       </ns0:GrantedTrade>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:Tradeline>
 </ns0:TradeLinePartition>
 <ns0:TradeLinePartition accountTypeDescription="Revolving Account" accountTypeSymbol="R" accountTypeAbbreviation="Revolving">
    <ns0:Tradeline accountNumber="4X1X1X0X1X2X2X7X" creditorName="WACHOVIA-BANKCARD" currentBalance="0" dateAccountStatus="2015-08-02-07:00" dateClosed="2015-08-02-07:00" dateOpened="2013-10-10-07:00" highBalance="0" subscriberCode="3763001" position="9" bureau="TransUnion" handle="TR01_-973781138_-355912080_82">
       <ns0:AccountCondition abbreviation="Derog" description="Derogatory" symbol="F" rank="20"/>
       <ns0:AccountDesignator abbreviation="Individual" description="Individual" symbol="I" rank="199"/>
       <ns0:DisputeFlag abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:IndustryCode abbreviation="Bank Credit Cards" description="Bank Credit Cards" symbol="BC" rank="199"/>
       <ns0:OpenClosed abbreviation="Open" description="Open" symbol="O" rank="199"/>
       <ns0:PayStatus abbreviation="Unk" description="Unknown" symbol="U" rank="10000"/>
       <ns0:VerificationIndicator abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Remark customRemark="">
          <ns0:RemarkCode abbreviation="Chapter 7 bankruptcy" description="Chapter 7 bankruptcy" symbol="T00CBL" rank="199"/>
       </ns0:Remark>
       <ns0:GrantedTrade amountPastDue="0" collateral="" dateLastPayment="2015-07-20-07:00" late30Count="0" late60Count="0" late90Count="0" monthlyPayment="0" monthsReviewed="0" termMonths="0" worstPatStatusCount="0">
          <ns0:AccountType abbreviation="Credit Card" description="Credit Card" symbol="CC" rank="50"/>
          <ns0:CreditType abbreviation="Revolving" description="Revolving Account" symbol="R" rank="50"/>
          <ns0:PaymentFrequency abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:TermType abbreviation="Provided" description="Provided" symbol="P" rank="199"/>
          <ns0:WorstPayStatus abbreviation="" description="" symbol="" rank="100000"/>
          <ns0:PayStatusHistory/>
          <ns0:CreditLimit>0</ns0:CreditLimit>
       </ns0:GrantedTrade>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:Tradeline>
 </ns0:TradeLinePartition>
 <ns0:PulblicRecordPartition>
    <ns0:PublicRecord courtName="" referenceNumber="9X4X6X3" subscriberCode="4871356" bureau="TransUnion" handle="PR01_1618166926_561087734">
       <ns0:AccountDesignator abbreviation="" description="" symbol="" rank="100000"/>
       <ns0:Classification abbreviation="Bankruptcy" description="Bankruptcy" symbol="B" rank="199"/>
       <ns0:IndustryCode abbreviation="Personal Service Reseller" description="Personal Service Reseller" symbol="ZP" rank="199"/>
       <ns0:Status abbreviation="Discharged" description="Discharged" symbol="1" rank="199"/>
       <ns0:Type abbreviation="Chapter 7 Bankruptcy" description="Chapter 7 Bankruptcy" symbol="1" rank="199"/>
       <ns0:Bankruptcy courtNumber="" division="" assetAmount="0" dateResolved="2016-01-25-08:00" exemptAmount="0" liabilityAmount="0" trustee="" company="" thirdParty=""/>
       <ns0:Source>
          <ns0:BorrowerKey></ns0:BorrowerKey>
          <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
          <ns0:Reference></ns0:Reference>
       </ns0:Source>
    </ns0:PublicRecord>
 </ns0:PulblicRecordPartition>
 <ns0:Subscriber name="CARD PRODUCTS" telephone="Phone number not available" subscriberCode="927P029">
    <ns0:CreditAddress city="CHARLOTTE" stateCode="NC" unparsedStreet="PO BOX 563966" postalCode="282560001"/>
    <ns0:IndustryCode abbreviation="" description="" symbol="" rank="100000"/>
    <ns0:Source>
       <ns0:BorrowerKey></ns0:BorrowerKey>
       <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
       <ns0:Reference></ns0:Reference>
    </ns0:Source>
 </ns0:Subscriber>
 <ns0:Subscriber name="CHASE NA" telephone="Phone number not available" subscriberCode="402D013">
    <ns0:CreditAddress city="WESTERVILLE" stateCode="OH" unparsedStreet="880 BROOKS EDGE BLVD" postalCode="43081"/>
    <ns0:IndustryCode abbreviation="" description="" symbol="" rank="100000"/>
    <ns0:Source>
       <ns0:BorrowerKey></ns0:BorrowerKey>
       <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
       <ns0:Reference></ns0:Reference>
    </ns0:Source>
 </ns0:Subscriber>
 <ns0:Subscriber name="CITIBANK UCS" telephone="(904) 954-7500" subscriberCode="8194006">
    <ns0:CreditAddress city="SIOUX FALLS" stateCode="SD" unparsedStreet="701 E 60TH ST N" postalCode="57104"/>
    <ns0:IndustryCode abbreviation="" description="" symbol="" rank="100000"/>
    <ns0:Source>
       <ns0:BorrowerKey></ns0:BorrowerKey>
       <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
       <ns0:Reference></ns0:Reference>
    </ns0:Source>
 </ns0:Subscriber>
 <ns0:Subscriber name="DISCOVER FINCL SVC LLC" telephone="(800) 347-2683" subscriberCode="9616003">
    <ns0:CreditAddress city="WILMINGTON" stateCode="DE" unparsedStreet="1072 SW 101 St,Test 68" postalCode="198505316"/>
    <ns0:IndustryCode abbreviation="" description="" symbol="" rank="100000"/>
    <ns0:Source>
       <ns0:BorrowerKey></ns0:BorrowerKey>
       <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
       <ns0:Reference></ns0:Reference>
    </ns0:Source>
 </ns0:Subscriber>
 <ns0:Subscriber name="FIRST USA BANK" telephone="(800) 283-1211" subscriberCode="3429001">
    <ns0:CreditAddress city="ELGIN" stateCode="IL" unparsedStreet="2500 WESTFIELD DR" postalCode="60124"/>
    <ns0:IndustryCode abbreviation="" description="" symbol="" rank="100000"/>
    <ns0:Source>
       <ns0:BorrowerKey></ns0:BorrowerKey>
       <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
       <ns0:Reference></ns0:Reference>
    </ns0:Source>
 </ns0:Subscriber>
 <ns0:Subscriber name="ITT FIN" telephone="Phone number not available" subscriberCode="64DB002">
    <ns0:CreditAddress city="SOUIX FALLS" stateCode="SD" unparsedStreet="PO BOX 6241" postalCode="57117"/>
    <ns0:IndustryCode abbreviation="" description="" symbol="" rank="100000"/>
    <ns0:Source>
       <ns0:BorrowerKey></ns0:BorrowerKey>
       <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
       <ns0:Reference></ns0:Reference>
    </ns0:Source>
 </ns0:Subscriber>
 <ns0:Subscriber name="M.WARD/MBGA" telephone="Phone number not available" subscriberCode="235007R">
    <ns0:CreditAddress city="LENEXA" stateCode="KS" unparsedStreet="PO BOX 29114" postalCode="66215"/>
    <ns0:IndustryCode abbreviation="" description="" symbol="" rank="100000"/>
    <ns0:Source>
       <ns0:BorrowerKey></ns0:BorrowerKey>
       <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
       <ns0:Reference></ns0:Reference>
    </ns0:Source>
 </ns0:Subscriber>
 <ns0:Subscriber name="SEARS ROEBUCK &amp; CO" telephone="(800) 326-0115" subscriberCode="6256385">
    <ns0:CreditAddress city="CLEVELAND" stateCode="OH" unparsedStreet="13200 SMITH ROAD" postalCode="441306282"/>
    <ns0:IndustryCode abbreviation="" description="" symbol="" rank="100000"/>
    <ns0:Source>
       <ns0:BorrowerKey></ns0:BorrowerKey>
       <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
       <ns0:Reference></ns0:Reference>
    </ns0:Source>
 </ns0:Subscriber>
 <ns0:Subscriber name="TRANSAMERICA BANK" telephone="Phone number not available" subscriberCode="930N133">
    <ns0:CreditAddress city="CRYSTAL LAKE" stateCode="IL" unparsedStreet="POB 130" postalCode="60139"/>
    <ns0:IndustryCode abbreviation="" description="" symbol="" rank="100000"/>
    <ns0:Source>
       <ns0:BorrowerKey></ns0:BorrowerKey>
       <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
       <ns0:Reference></ns0:Reference>
    </ns0:Source>
 </ns0:Subscriber>
 <ns0:Subscriber name="WACHOVIA-BANKCARD" telephone="Phone number not available" subscriberCode="3763001">
    <ns0:CreditAddress city="WINSTON-SALEM" stateCode="NC" unparsedStreet="PO BOX 3117" postalCode="27102"/>
    <ns0:IndustryCode abbreviation="" description="" symbol="" rank="100000"/>
    <ns0:Source>
       <ns0:BorrowerKey></ns0:BorrowerKey>
       <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
       <ns0:Reference></ns0:Reference>
    </ns0:Source>
 </ns0:Subscriber>
 <ns0:Summary>
    <ns0:TradelineSummary>
       <ns0:TransUnion TotalAccounts="10" OpenAccounts="9" CloseAccounts="1" DelinquentAccounts="0" DerogatoryAccounts="7" TotalBalances="0.0" TotalMonthlyPayments="0.0"/>
    </ns0:TradelineSummary>
    <ns0:InquirySummary>
       <ns0:TransUnion NumberInLast2Years="0"/>
    </ns0:InquirySummary>
    <ns0:PublicRecordSummary>
       <ns0:TransUnion NumberOfRecords="1"/>
    </ns0:PublicRecordSummary>
 </ns0:Summary>
 <ns0:Sources>
    <ns0:Source>
       <ns0:Bureau abbreviation="TransUnion" description="TransUnion" symbol="TUC" rank="1"/>
    </ns0:Source>
 </ns0:Sources>
 <ns0:SafetyCheckPassed>true</ns0:SafetyCheckPassed>
</trueLinkCreditReportType>]]></a:InvestigationResults>
    </GetInvestigationResultsResult>
  </GetInvestigationResultsResponse>
</s:Body>
</s:Envelope>`;
