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
      }
    }
    agencies {
      __typename
      transunion {
        __typename
        authenticated
        indicativeEnrichmentSuccess
        getAuthenticationQuestionsSuccess
        serviceBundleFulfillmentKey
        currentRawQuestions
        currentRawAuthDetails
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
          disputePreflightStatus
          disputeInflightStatus
          disputeEligibility
          disputeResults
          disputeHistory
          modifiedOn
          createdOn
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
  getLastActiveOnboardingQuery(id: $id) {
    user {
      id
      onboarding {
        lastActive
      }
    }
  }
}`;

/**
 * Gets the transunion disputes by user
 * @param {ID!} id user identity id
 */
export const getTransunionDisputes = `query GetAppData($id: ID!) {
  getTransunionDisputes(id: $id) {
    id
    agencies {
      transunion {
        disputes {
          createdOn
          disputeEligibility
          disputeHistory
          disputeInflightStatus
          disputePreflightStatus
          disputeResults
          modifiedOn
          notificationMessage
          notificationSentOn
          notificationStatus
        }
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

export const qryGetFulfilledOn = `query GetAppData($id: ID!) {
  getFulfilledOn(id: $id) {
    agencies {
      transunion {
        fulfilledOn
      }
    }
  }
}`;

export const qryGetDataForEnrollment = `query GetAppData($id: ID!) {
  getDataForEnrollment(id: $id) {
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
  getDateForFulfill(id: $id) {
    id
    agencies {
      transunion {
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
      }
    }
    agencies {
      __typename
      transunion {
        __typename
        authenticated
        indicativeEnrichmentSuccess
        getAuthenticationQuestionsSuccess
        serviceBundleFulfillmentKey
        currentRawQuestions
        currentRawAuthDetails
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
          disputePreflightStatus
          disputeInflightStatus
          disputeEligibility
          disputeResults
          disputeHistory
          modifiedOn
          createdOn
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

/**
 * Gets the transunion disputes preflight status
 * @param {ID!} id user identity id
 * @param {string} msg JSON string of Dispute object
 */
export const patchDisputes = `mutation PatchDisputes($id: ID!, $msg: String ) {
  patchDisputes(id: $id, msg: $msg) {
    disputePreflightStatus
    disputeInflightStatus
    disputeEligibility
    disputeResults
    modifiedOn
    createdOn
    notificationStatus
    notificationMessage
    notificationSentOn
    disputeHistory
  }
}`;
