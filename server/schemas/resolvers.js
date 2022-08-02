// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    //object holds a nested object
    Query: {

        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks')

                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },

        // get a single user by either their id or their username
        // user: async (parent, { params }) => {
        //     return User.findOne({
        //         // SELECT * FROM users WHERE _id = '%1' OR username = '%2'
        //         $or: [
        //             { _id: params },
        //             { username: params }
        //         ],
        //     })
        //         .select('-__v -password')
        //         .populate('savedBooks')
        // }
    },
    Mutation: {

        addUser: async (parent, args ) => {
            const user = await User.create(args);
            if (!user) {
                throw new AuthenticationError('Something is wrong!');
            }
            const token = signToken(user);

            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                )
                return updatedUser
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }
}

module.exports = resolvers;