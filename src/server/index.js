import express from "express";
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");

import { authenticated, authentification, register } from "./middleware/auth";

const app = new express();

//port for the app
const { APP_PORT, PORT } = process.env;
const port = APP_PORT || PORT || 4001;

app.use(bodyParser.json());
app.post("/get-token", authentification);
app.post("/register", register);

const schema = require("./schema/schema");
app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

// app.use(admin);

app.listen(port, () => console.log(`listening on port ${port}!`));
