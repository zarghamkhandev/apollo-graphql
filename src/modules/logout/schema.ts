import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    dummy: String
  }
  extend type Mutation {
    logout: Boolean
  }
`;
