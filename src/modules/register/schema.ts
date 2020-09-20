import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Mutation {
    register(email: String!, password: String!): [Error!]
  }
  type Error {
    path: String!
    message: String!
  }
`;
