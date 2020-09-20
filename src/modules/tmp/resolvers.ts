import { Resolvers } from "../../types/resolvers-types";

export const resolvers: Resolvers = {
  Query: {
    hello: (_, { name }) => {
      return `Hello ${name}`;
    },
  },
};
