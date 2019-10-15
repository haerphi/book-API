const knex = require("knex");

let user = null;
let mdp = null;
let host = null;
let database = null;
let port = null;

let url = process.env.DATABASE_URL;
if (url) {
  url = url.substr(11);
  user = url.substr(0, url.indexOf(":")); //ok on a récupérer le user
  url = url.substr(url.indexOf(":") + 1);

  mdp = url.substr(0, url.indexOf("@")); //ok on a récupérer le mdp
  url = url.substr(url.indexOf("@") + 1);

  host = url.substr(0, url.indexOf(":")); //ok on a récupérer le host
  url = url.substr(url.indexOf(":") + 1);

  port = url.substr(0, url.indexOf("/")); //ok on a récupérer le port
  url = url.substr(url.indexOf("/") + 1);
  database = url; //ok on a récupérer le nom de la database
}
module.exports = knex({
  client: "pg",
  version: "7.2",
  // connection: {
  //   host: host || "postgres",
  //   user: user || "dev",
  //   password: mdp || "dev",
  //   database: database || "booksApi"
  // }
  connection: process.env.DATABASE_URL
});
