//==============================
//          QUERIES
//==============================
/** Full get AppData */
export const qryGetAppData = `query GetAppData($id: ID!) {
  getAppData(id: $id) {
    __typename
    id
    user {
      __typename
      id
      userAttributes {
        __typename
        name {
          __typename
          first
          middle
          last
        }
        address {
          __typename
          addressOne
          addressTwo
          city
          state
          zip
        }
        phone {
          __typename
          primary
        }
        dob {
          __typename
          year
          month
          day
        }
        ssn {
          __typename
          lastfour
          full
        }
      }
      onboarding {
        __typename
        lastActive
        lastComplete
        started
        display {
          __typename
          id
          active
          complete
          name
        }
      }
    }
    agencies {
      __typename
      transunion {
        __typename
        authenticated
        indicativeEnrichmentSuccess
        indicativeEnrichmentStatus {
          __typename
          id
          status
          statusDescription
          statusModifiedOn
          statusCode
        }
        getAuthenticationQuestionsSuccess
        getAuthenticationQuestionsStatus {
          __typename
          id
          status
          statusDescription
          statusModifiedOn
          statusCode
        }
        verifyAuthenticationQuestionsOTPSuccess
        verifyAuthenticationQuestionsOTPStatus {
          __typename
          id
          status
          statusDescription
          statusModifiedOn
          statusCode
        }
        verifyAuthenticationQuestionsKBASuccess
        verifyAuthenticationQuestionsKBAStatus {
          __typename
          id
          status
          statusDescription
          statusModifiedOn
          statusCode
        }
        serviceBundleFulfillmentKey
        currentRawQuestions
        currentRawAuthDetails
        authAttempt
        pinRequests
        pinAttempts
        pinCurrentAge
        kbaAttempts
        kbaCurrentAge
        enrollmentKey
        enrollReport {
          __typename
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        enrollMergeReport {
          __typename
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        enrollVantageScore {
          __typename
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        enrolled
        enrolledOn
        fulfillReport {
          __typename
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        fulfillMergeReport {
          __typename
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        fulfillVantageScore {
          __typename
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        fulfilledOn
        acknowledgedDisputeTerms
        acknowledgedDisputeTermsOn
        disputeServiceBundleFulfillmentKey
        disputeEnrollmentKey
        disputeEnrolled
        disputeEnrolledOn
        disputeStatus
        disputes {
          __typename
          id
          appDataId
          disputeId
          disputeStatus
          disputeLetterCode
          disputeLetterContent
          openDisputes {
            __typename
            estimatedCompletionDate
            lastUpdatedDate
            openDate
            requestedDate
            totalClosedDisputedItems
            totalDisputedItems
            totalOpenDisputedItems
            totalPVDisputedItemCount
          }
          closedDisputes {
            __typename
            estimatedCompletionDate
            lastUpdatedDate
            openDate
            requestedDate
            totalClosedDisputedItems
            totalDisputedItems
            totalOpenDisputedItems
            totalPVDisputedItemCount
          }
          pvDisputedItems {
            __typename
            pvTradelines
            pvPublicRecords
          }
          agencyName
          openedOn
          closedOn
          disputeItems
          disputeInvestigationResults
          disputeCreditBureau
          notificationStatus
          notificationMessage
          notificationSentOn
        }
      }
      equifax {
        __typename
        authenticated
      }
      experian {
        __typename
        authenticated
      }
    }
    preferences {
      __typename
      showAllAccounts {
        __typename
        creditCards
        collectionsAccounts
        installmentLoans
        mortgages
      }
    }
    status
    statusReason
    statusReasonDescription
    lastStatusModifiedOn
    nextStatusModifiedOn
    createdAt
    updatedAt
    owner
  }
}`;
/**
 * Gets the last active task for onboarding
 * @param {ID!} id user identity id
 */
export const getLastActiveOnboardingQuery = `query GetAppData($id: ID!) {
  getAppData(id: $id) {
    user {
      id
      onboarding {
        lastActive
      }
    }
  }
}`;

export const qryGetEnrollment = `query GetAppData($id: ID!) {
  getEnrollment(id: $id) {
    agencies {
      transunion {
        enrolled
      }
    }
  }
}`;

export const qryGetDisputeEnrollment = `query GetAppData($id: ID!) {
  getAppData(id: $id) {
    agencies {
      transunion {
        disputeEnrolled
      }
    }
  }
}`;

export const qryGetFulfilledOn = `query GetAppData($id: ID!) {
  getAppData(id: $id) {
    agencies {
      transunion {
        fulfilledOn
      }
    }
  }
}`;

export const qryGetDataForEnrollment = `query GetAppData($id: ID!) {
  getAppData(id: $id) {
    id
    user {
      userAttributes {
        name {
          first
          middle
          last
        }
        address {
          addressOne
          addressTwo
          city
          state
          zip
        }
        phone {
          primary
        }
        dob {
          year
          month
          day
        }
        ssn {
          lastfour
          full
        }
      }
    }
  }
}`;

export const qryGetDataForFulfill = `query GetAppData($id: ID!) {
  getAppData(id: $id) {
    id
    agencies {
      transunion {
        enrollmentKey
        disputeEnrollmentKey
        serviceBundleFulfillmentKey
        disputeServiceBundleFulfillmentKey
      }
    }
    user {
      userAttributes {
        name {
          first
          middle
          last
        }
        address {
          addressOne
          addressTwo
          city
          state
          zip
        }
        phone {
          primary
        }
        dob {
          year
          month
          day
        }
        ssn {
          lastfour
          full
        }
      }
    }
  }
}`;

export const qryGetDataForGetDisputeStatus = `query GetAppData($id: ID!) {
  getAppData(id: $id) {
    id
    agencies {
      transunion {
        disputeEnrollmentKey
      }
    }
    user {
      userAttributes {
        name {
          first
          middle
          last
        }
        address {
          addressOne
          addressTwo
          city
          state
          zip
        }
        phone {
          primary
        }
        dob {
          year
          month
          day
        }
        ssn {
          lastfour
          full
        }
      }
    }
  }
}`;

export const qryGetDataForGetDisputeHistory = `query GetAppData($id: ID!) {
  getAppData(id: $id) {
    id
    agencies {
      transunion {
        disputeEnrollmentKey
      }
    }
  }
}`;

export const qryGetDataForGetInvestigationResults = `query GetAppData($id: ID!) {
  getAppData(id: $id) {
    id
    agencies {
      transunion {
        disputeEnrollmentKey
      }
    }
  }
}`;

export const qryGetDataForStartDisputes = `query GetAppData($id: ID!) {
  getAppData(id: $id) {
    id
    user {
      userAttributes {
        name {
          first
          middle
          last
        }
        address {
          addressOne
          addressTwo
          city
          state
          zip
        }
        dob {
          year
          month
          day
        }
        ssn {
          lastfour
          full
        }
      }
    }
    agencies {
      transunion {
        disputeEnrollmentKey
        disputeServiceBundleFulfillmentKey
        serviceBundleFulfillmentKey
      }
    }
  }
}`;

export const qryGetDispute = `query GetDispute($id: ID!) {
  getDispute(id: $id) {
    __typename
    id
    agencyId
    disputeId
    disputeStatus
    openedOn
    closedOn
    disputeResults
    notificationStatus
    notificationMessage
    notificationSentOn
    createdAt
    updatedAt
    owner
  }
}`;

//==============================
//          MUTATIONS
//==============================
/** Full update AppData */
export const qryUpdateAppData = `mutation UpdateAppData($input: UpdateAppDataInput!, $condition: ModelAppDataConditionInput) {
  updateAppData(input: $input, condition: $condition) {
    __typename
    id
    user {
      __typename
      id
      userAttributes {
        __typename
        name {
          __typename
          first
          middle
          last
        }
        address {
          __typename
          addressOne
          addressTwo
          city
          state
          zip
        }
        phone {
          __typename
          primary
        }
        dob {
          __typename
          year
          month
          day
        }
        ssn {
          __typename
          lastfour
          full
        }
      }
      onboarding {
        __typename
        lastActive
        lastComplete
        started
        display {
          __typename
          id
          active
          complete
          name
        }
      }
    }
    agencies {
      __typename
      transunion {
        __typename
        authenticated
        indicativeEnrichmentSuccess
        indicativeEnrichmentStatus {
          __typename
          id
          status
          statusDescription
          statusModifiedOn
          statusCode
        }
        getAuthenticationQuestionsSuccess
        getAuthenticationQuestionsStatus {
          __typename
          id
          status
          statusDescription
          statusModifiedOn
          statusCode
        }
        verifyAuthenticationQuestionsOTPSuccess
        verifyAuthenticationQuestionsOTPStatus {
          __typename
          id
          status
          statusDescription
          statusModifiedOn
          statusCode
        }
        verifyAuthenticationQuestionsKBASuccess
        verifyAuthenticationQuestionsKBAStatus {
          __typename
          id
          status
          statusDescription
          statusModifiedOn
          statusCode
        }
        serviceBundleFulfillmentKey
        currentRawQuestions
        currentRawAuthDetails
        authAttempt
        pinRequests
        pinAttempts
        pinCurrentAge
        kbaAttempts
        kbaCurrentAge
        enrollmentKey
        enrollReport {
          __typename
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        enrollMergeReport {
          __typename
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        enrollVantageScore {
          __typename
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        enrolled
        enrolledOn
        fulfillReport {
          __typename
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        fulfillMergeReport {
          __typename
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        fulfillVantageScore {
          __typename
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
        fulfilledOn
        acknowledgedDisputeTerms
        acknowledgedDisputeTermsOn
        disputeServiceBundleFulfillmentKey
        disputeEnrollmentKey
        disputeEnrolled
        disputeEnrolledOn
        disputeStatus
        disputes {
          __typename
          id
          appDataId
          disputeId
          disputeStatus
          disputeLetterCode
          disputeLetterContent
          openDisputes {
            __typename
            estimatedCompletionDate
            lastUpdatedDate
            openDate
            requestedDate
            totalClosedDisputedItems
            totalDisputedItems
            totalOpenDisputedItems
            totalPVDisputedItemCount
          }
          closedDisputes {
            __typename
            estimatedCompletionDate
            lastUpdatedDate
            openDate
            requestedDate
            totalClosedDisputedItems
            totalDisputedItems
            totalOpenDisputedItems
            totalPVDisputedItemCount
          }
          pvDisputedItems {
            __typename
            pvTradelines
            pvPublicRecords
          }
          agencyName
          openedOn
          closedOn
          disputeItems
          disputeInvestigationResults
          disputeCreditBureau
          notificationStatus
          notificationMessage
          notificationSentOn
        }
      }
      equifax {
        __typename
        authenticated
      }
      experian {
        __typename
        authenticated
      }
    }
    preferences {
      __typename
      showAllAccounts {
        __typename
        creditCards
        collectionsAccounts
        installmentLoans
        mortgages
      }
    }
    status
    statusReason
    statusReasonDescription
    lastStatusModifiedOn
    nextStatusModifiedOn
    createdAt
    updatedAt
    owner
  }
}`;

/**
 * Gets the transunion disputes preflight status
 * @param {ID!} id user identity id
 * @param {string} disputePreflightStatus 'failed | success'
 */
export const updatePreflightStatus = `mutation UpdatePreflightStatus($id: ID!, $disputePreflightStatus: String ) {
  updatePreflightStatus(id: $id, disputePreflightStatus: $disputePreflightStatus) {
    id
    agencies {
      transunion {
        disputes {
          disputePreflightStatus
        }
      }
    }
  }
}`;
