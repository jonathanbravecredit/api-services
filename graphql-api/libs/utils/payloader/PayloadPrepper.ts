import { GraphQL } from 'libs/utils/graphql/GraphQL';

export class PayloadPrepper<T> {
  data: T;
  constructor() {}

  async prep<V>(query: string, variables: V): Promise<void> {
    const graphQL = new GraphQL(query, variables);
    const resp = await graphQL.postGraphQLRequest<T>();
    this.data = resp.data;
  }
}
