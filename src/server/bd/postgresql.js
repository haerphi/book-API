export const knex = require("knex")({
  client: "pg",
  version: "7.2",
  connection: {
    host: "127.0.0.1",
    user: "dev",
    password: "dev",
    database: "booksApi"
  }
});
