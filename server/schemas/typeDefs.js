// import the gql tagged template with function
const { gql } = require('apollo-server-express');

// create our typeDefs
// Template literals (Template strings) or tagged template function
const typeDefs = gql`

# user literal
type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}
# book literal
type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
}
# input of the book data
input BookInput {
    authors: [String]
    description: String
    title: String
    bookId: String
    image: String
    link: String
}
# Query of me return user
type Query {
    me: User
  }


# mutations for login and addUser return authentication of the user with token. Save and remove book return the user updated info
type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
}
# authentication of the user with creating token.
type Auth {
    token: ID!
    user: User
}
`;

// export the typeDefs
module.exports = typeDefs;