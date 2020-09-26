import { Resolvers } from '../../types/resolvers-types';
import argon from 'argon2';
import { User } from '../../entities/User';
import * as zod from 'zod';
import { formatZodError } from '../../utils/formatZodError';
import { createConfirmEmailLink } from '../../utils/createConfirmEmailLink';
import { sendEmail } from '../../utils/sendEmail';

const schema = zod.object({
  email: zod.string().email().min(3).max(255),
  password: zod.string().min(3).max(255),
});

export const resolvers: Resolvers = {
  Mutation: {
    register: async (_, args, { redis, url }) => {
      const { email, password } = args;
      try {
        schema.parse(args);
      } catch (err) {
        console.log(err);
        return formatZodError(err);
      }

      const UserAlreadyExists = await User.findOne({
        where: { email },
        select: ['id'],
      });
      if (UserAlreadyExists) {
        return [{ path: 'email', message: 'email already taken' }];
      }
      const hashedPassword = await argon.hash(password);
      const user = User.create({
        email: email,
        password: hashedPassword,
      });
      await user.save();

      const link = await createConfirmEmailLink(url, user.id, redis);
      await sendEmail(email, link);
      return null;
    },
  },
};
