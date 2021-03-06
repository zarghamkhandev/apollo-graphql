import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Mutation {
    register(email: String!, password: String!): [Error!]
  }
`;
