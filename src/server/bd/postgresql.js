const knex = require("knex");
console.log(process.env.DATABASE_URL);
module.exports = knex({
  client: "pg",
  version: "7.2",
  connection: process.env.DATABASE_URL
});
