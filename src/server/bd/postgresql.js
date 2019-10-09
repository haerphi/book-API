const knex = require("knex");

console.log(process.env);

module.exports = knex({
  client: "pg",
  version: "7.2",
  connection: {
    host: "postgres",
    user: "dev",
    password: "dev",
    database: "booksApi"
  }
});
