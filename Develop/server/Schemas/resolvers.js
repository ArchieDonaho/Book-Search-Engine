// TODO Define the query and mutation functionality to work with the Mongoose models
const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // check if the user is logged in or not
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks');
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect Credentials');
      }
      const correctPass = await user.isCorrectPassword(password);
      if (!correctPass) {
        throw new AuthenticationError('ncorrect Credentials');
      }
      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, args, context) => {
      console.log(args);
      if (context.user) {
        const userData = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args } },
          { new: true, runValidators: true }
        );
        return userData;
      }
      throw new AuthenticationError('you need to be logged in to save books');
    },

    removeBook: async (parent, { bookId }, context) => {
      console.log(bookId);
      if (context.user) {
        const userData = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return userData;
      }
      throw new AuthenticationError('you need to be logged');
    },
  },
};

module.exports = resolvers;
