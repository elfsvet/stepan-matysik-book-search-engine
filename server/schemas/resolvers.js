const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require('../utils/auth');
// creating the resolvers
const resolvers = {
    // define the query to work with the Mongoose models
    Query: {
        // query to return the info for the logged in user.
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password');

                return userData;
            }
            throw new AuthenticationError('Not logged in');
        }
    },
    // define the mutation functionality to work with the Mongoose models
    Mutation: {
        // to add a user will create a user and we will get token from utils auth signToken function
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        // login to the account with email and password
        login: async (parent, { email, password }) => {
            // find the user with the email
            const user = await User.findOne({ email });
            // no user with this email
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            // check the password
            const correctPw = await user.isCorrectPassword(password);
            // password wrong give an error
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            // login the user and create a token
            const token = signToken(user);
            return { token, user };
        },
        // save a book on the click. Gets the book data from the clicked book to save it to the user
        saveBook: async (parent, { bookData }, context) => {
            // if user logged in
            if (context.user) {
                // update the user with new book to the list of saved books.
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        // delete the book from the list if user logged in. Find a book to delete by the id of the book in savedBooks list.
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }
}
// exports resolvers
module.exports = resolvers;