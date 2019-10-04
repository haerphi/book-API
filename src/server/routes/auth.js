const jwt = require("jsonwebtoken");
import PG from "../postgres";
const secret = process.env.JWT_SECRET || "secret";

export const authRoute = async ctx => {
  console.log(ctx.request.body);
  const { email, password } = ctx.request.body;
  if (!email) ctx.throw(422, "email required.");
  if (!password) ctx.throw(422, "Password required.");

  const dbUser = await PG.from("users").where({ email, password });
  if (dbUser.length > 0) {
    const payload = { sub: 1 };

    const token = jwt.sign(payload, secret);
    ctx.body = token;
  } else {
    ctx.throw(401, "Email or password doesn't match");
  }
};
