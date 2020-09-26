import { Resolvers } from '../../types/resolvers-types';

export const resolvers: Resolvers = {
  Mutation: {
    logout: async (_, __, { session, redis }) => {
      const { userId } = session;

      if (userId) {
        const sessionIds = await redis.lrange(userId, 0, -1);
        sessionIds.forEach(async (id: string) => {
          await redis.lpop(userId);
        });
        console.log(sessionIds);

        return true;
      }

      return false;
    },
  },
};
