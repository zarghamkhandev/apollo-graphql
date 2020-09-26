import { User } from '../../entities/User';
import { Resolvers } from '../../types/resolvers-types';

export const resolvers: Resolvers = {
  Query: {
    me: async (_, __, { session }) => {
      const user = await User.findOne({ where: { id: session.userId } });

      if (!user) {
        return null;
      }
      return user;
    },
  },
};
