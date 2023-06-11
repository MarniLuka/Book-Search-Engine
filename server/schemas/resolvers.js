const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async ()
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create ({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        loginUser: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user with this email address. Try again or sign up.');
            }

            const checkPassword = await user.isCorrectPassword(password);

            if (!checkPassword) {
                throw new AuthenticationError('Incorrect password! Try again or sign up.');
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { bookInfo }) => {

        },
        removeBook: async (parent, { bookId }) => {
            return User.findOneAndDelete({ bookId })
        }
    }
}


module.exports = resolvers;