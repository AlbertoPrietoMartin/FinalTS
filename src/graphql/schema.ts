import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    id: ID!
  }

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;