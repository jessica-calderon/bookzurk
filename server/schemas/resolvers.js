const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      throw new AuthenticationError("Not Logged In");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials 😖");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials 😖");
      }
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updatedBook = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: args } },
          { new: true, runValidators: true }
        );
        return updatedBook;
      }
      throw new AuthenticationError("Please Sign In First!");
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedBook = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedBook;
      }
      throw new AuthenticationError("Please Sign In First!");
    },
  },
};

module.exports = resolvers;
