const Koa = require("koa");
import { errorHandler } from "./middleware/errorHandler";
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");

const authRoute = require("./routes/auth").authRoute;

const app = new Koa();
const router = new Router();

app.use(errorHandler);

router.post("/auth", bodyParser(), authRoute);

let port = process.env.PORT || 3000;

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, () => {
    console.log(port);
  });
