//Nécessaire pour la connexion à la BD
const pg = require("pg");
const conString = "postgres://dev:dev@postgres:5432/test";

async function doRequest(pg, url) {
  //connexion à la bd
  const client = new pg.Client(url);
  client.connect();

  /*Select example*/
  var rep = await client.query("SELECT * FROM users");
  console.log(rep.rows);

  /*Insert example*/
  // await client.query({
  //   name: "insert beatle",
  //   text: "INSERT INTO beatles(name, height, birthday) values($1, $2, $3)",
  //   values: ["George", 70, new Date(1946, 02, 14)]
  // });
  client.end();
}

doRequest(pg, conString);

console.log("plop");
