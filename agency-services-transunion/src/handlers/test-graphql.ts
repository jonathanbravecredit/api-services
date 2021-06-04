// import * as axios from 'axios';
// import gql from 'graphql-tag';
// import * as graphql from 'graphql';
// const { print } = graphql;

// const getAppdata = gql`
//   query GetAppData($id: ID!) {
//   getAppData(id: $id) {
//     id
//     user {
//       id
//       userAttributes {
//         name {
//           first
//           middle
//           last
//         }
//         address {
//           addressOne
//           addressTwo
//           city
//           state
//           zip
//         }
//         phone {
//           primary
//         }
//         dob {
//           year
//           month
//           day
//         }
//         ssn {
//           lastfour
//           full
//         }
//       }
//       onboarding {
//         lastActive
//         lastComplete
//       }
//     }
//     agencies {
//       transunion {
//         authenticated
//       }
//       equifax {
//         authenticated
//       }
//       experian {
//         authenticated
//       }
//     }
//     createdAt
//     updatedAt
//   }
// }
// `

export const main = async (event) => {
}

// exports.main = async (event) => {
//   // try {
//   //   const graphqlData = await axios({
//   //     url: 'https://24ga46y3gbgodogktqwhh7vryq.appsync-api.us-east-2.amazonaws.com/graphql', // process.env.API_URL,
//   //     method: 'post',
//   //     headers: {
//   //       'x-api-key': process.env.API_<YOUR_API_NAME>_GRAPHQLAPIKEYOUTPUT
//   //     },
//   //     data: {
//   //       query: print(listTodos),
//   //     }
//   //   });
//   //   const body = {
//   //       graphqlData: graphqlData.data.data.listTodos
//   //   }
//   //   return {
//   //       statusCode: 200,
//   //       body: JSON.stringify(body),
//   //       headers: {
//   //           "Access-Control-Allow-Origin": "*",
//   //       }
//   //   }
//   // } catch (err) {
//   //   console.log('error posting to appsync: ', err);
//   // }
// }