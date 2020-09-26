import { User } from '../../entities/User';
import { Resolvers } from '../../types/resolvers-types';
import argon from 'argon2';
export const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { email, password }, { redis, url, session, req }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return [
          {
            path: 'email',
            message: 'Invalid Login',
          },
        ];
      }

      if (!user.confirmed) {
        return [
          {
            path: 'email',
            message: 'please confirm your email',
          },
        ];
      }

      const response = await argon.verify(user.password, password);
      if (!response) {
        return [
          {
            path: 'email',
            message: 'Invalid Login',
          },
        ];
      }
      session.userId = user.id;
      console.log(req.sessionID);

      if (req.sessionID) {
        await redis.lpush(user.id, req.sessionID);
      }

      return null;
    },
  },
};
