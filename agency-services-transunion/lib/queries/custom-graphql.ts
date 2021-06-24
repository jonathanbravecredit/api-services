//==============================
//          QUERIES
//==============================
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

/**
 * Gets the transunion disputes by user
 * @param {ID!} id user identity id
 */
export const getTransunionDisputes = `query GetAppData($id: ID!) {
  getAppData(id: $id) {
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

//==============================
//          MUTATIONS
//==============================

/**
 * Gets the transunion disputes preflight status
 * @param {ID!} id user identity id
 * @param {string} disputePreflightStatus 'failed | success'
 */
export const updatePreflightStatus = `query UpdatePreflightStatus($id: ID!, $disputePreflightStatus: String ) {
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
