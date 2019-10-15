const knex = require("knex");

module.exports = knex({
  client: "pg",
  version: "7.2",
  connection:
    process.env.DATABASE_URL || `postgres://dev:dev@postgres:5432/booksApi`
});
