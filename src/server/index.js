const Koa = require("koa");
const cors = require("@koa/cors");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const router = new Router();

import { errorHandler } from "./middleware/errorHandler";
import { authenticated } from "./middleware/authenticated";

const authRoute = require("./routes/auth").authRoute;
const booksRoute = require("./routes/books").booksRoute;

app.use(errorHandler);
app.use(cors());
router.post("/auth", bodyParser(), authRoute);
router.get("/books", authenticated, booksRoute);

let port = process.env.PORT || 3000;

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, () => {
    console.log(port);
  });
