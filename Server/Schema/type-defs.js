const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    age: Int!
    photo: String
    ntl: String!
    friends: [User]
    favoriteMovies: [Movie]
  }

  type Movie {
    id: ID!
    name: String!
    releaseDate: Int!
    isReleased: Boolean!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!
    movies: [Movie!]!
    movie(name: String!): Movie!
  }

  input CreateUserInput {
    name: String!
    username: String!
    age: Int!
    ntl: String!
    photo: String!
  }

  input UpdateUserInput {
    id: ID!
    newName: String!
    newUsername: String!
    newAge: Int!
  }

  input UpdateImgInput {
    name: String!
    username: String!
    filename: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(input: UpdateUserInput): User!
    deleteUser(id: ID!): User
    uploadImage(filename: String!): String!
    updateImage(input: UpdateImgInput!): User
  }

  enum Nationality {
    America
    India
  }
`;

module.exports = { typeDefs };
