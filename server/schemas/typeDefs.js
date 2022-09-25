const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    userBooks: [Book]
  }

  type Book {
    _id: ID
    author: String
    title: String
    description: String
    link: String
    img: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(
      bookId: String!
      authors: [String]!
      title: String!
      description: String
      img: String
      link: String
    ): User
    deleteBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
