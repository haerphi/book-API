import express from "express";
const bodyParser = require("body-parser");
//const graphqlHTTP = require("express-graphql");
const { ApolloServer } = require("apollo-server-express");
import { typeDefs, resolvers } from "./graphQL/schema";

import { authenticated, authentification, register } from "./middleware/auth";

const app = new express();

//port for the app
const { APP_PORT, PORT } = process.env;
const port = APP_PORT || PORT || 4001;

app.use(bodyParser.json());
app.post("/get-token", authentification);
app.post("/register", register);
app.get("/test", (req, res) => {
  console.log("test ok");
  res.send("test ok");
});

/*applolo*/
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // get the user token from the headers
    const token = req.headers.authorization || "";
    // try to retrieve a user with the token
    const user = await authenticated(token);
    // add the user to the context
    return { user };
  }
});
server.applyMiddleware({ app });

app.listen(port, () => console.log(`🚀🚀🚀 Listening on port: ${port}!`));
