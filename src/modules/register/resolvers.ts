import { Resolvers } from "../../types/resolvers-types";
import argon from "argon2";
import { User } from "../../entities/User";

export const resolvers: Resolvers = {
  Mutation: {
    register: async (_, { email, password }) => {
      const UserAlreadyExists = await User.findOne({
        where: { email },
        select: ["id"],
      });
      if (UserAlreadyExists) {
        return [{ path: "email", message: "already take" }];
      }
      const hashedPassword = await argon.hash(password);
      const user = User.create({
        email: email,
        password: hashedPassword,
      });
      await user.save();
      return null;
    },
  },
};
