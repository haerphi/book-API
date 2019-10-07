import express from "express";
const bodyParser = require("body-parser");
import { authenticated, authentification, register } from "./middleware/auth";

const app = new express();

//port for the app
const { APP_PORT, PORT } = process.env;
const port = APP_PORT || PORT || 4001;

app.use(bodyParser.json());
app.post("/get-token", authentification);
app.post("/register", register);

app.use(authenticated);
//protected route
app.post("/books", (req, res) => {
  console.log("All books");
  res.send("Here you'll get all books but you'll need to be auth");
});
app.post("/test", (req, res) => {
  console.log("test");
  res.send("Did it work ?");
});

// app.use(admin);

app.listen(port, () => console.log(`listening on port ${port}!`));
