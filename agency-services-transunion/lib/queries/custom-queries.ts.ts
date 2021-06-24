export const getAppDataQuery = `
query GetAppData($id: ID!) {
  getAppData(id: $id) {
    id
    user {
      id
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
      onboarding {
        lastActive
        lastComplete
        started
      }
    }
    agencies {
      transunion {
        authenticated
        indicativeEnrichmentSuccess
        getAuthenticationQuestionsSuccess
        serviceBundleFulfillmentKey
        currentRawQuestions
        currentRawAuthDetails
        enrollmentKey
        enrollReport {
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
          bureau
          errorResponse
          serviceProduct
          serviceProductFullfillmentKey
          serviceProductObject
          serviceProductTypeId
          serviceProductValue
          status
        }
      }
      equifax {
        authenticated
      }
      experian {
        authenticated
      }
    }
    createdAt
    updatedAt
    owner
  }
}
`;

export const updateAppDataMutation = `mutation UpdateAppData($input: UpdateAppDataInput!) {
  updateAppData(input: $input) {
  }
}`;

export const getUserLastActive = `query GetAppData($id: ID!) {
  getAppData(id: $id) {
    user {
      id
      onboarding {
        lastActive
      }
    }
  }
}`;

// export const getAppData = async (id: string): Promise<unknown> => {
//   try {
//     const result = await client.query({
//       query: gql(getAppDataQuery),
//       variables: { id },
//       fetchPolicy: 'network-only',
//     });
//     return result;
//   } catch (err) {
//     console.log('Error sending query: ', err);
//     return err;
//   }
// };

// export const updateAppData = async (data: UpdateAppDataInput): Promise<unknown> => {
//   try {
//     const result = await client.mutate({
//       mutation: gql(updateAppDataMutation),
//       variables: { input: data },
//       fetchPolicy: 'network-only',
//     });
//     return result;
//   } catch (err) {
//     console.log('Error sending mutation: ', err);
//     return err;
//   }
// };
