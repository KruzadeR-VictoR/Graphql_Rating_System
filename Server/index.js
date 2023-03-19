const { ApolloServer } = require("apollo-server");
const { typeDefs } = require("./Schema/type-defs");
const { resolvers } = require("./Schema/resolvers");

const server = new ApolloServer({ typeDefs, resolvers });

// Mongo SetUp
const mongoose = require("mongoose");
const MongoDB_Url =
  "mongodb+srv://victorbiju9:Victor007@graphqltest.rn91pi2.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(MongoDB_Url, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB is Connected");
    return server.listen();
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });

// server.listen().then(({ url }) => {
//   console.log(`API is runnig at : ${url}`);
// });
