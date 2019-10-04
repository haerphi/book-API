import knex from "knex";

export default knex({
  client: "pg",
  version: "7.2",
  connection: {
    host: "postgres",
    user: "dev",
    password: "dev",
    database: "booksApi"
  }
});
