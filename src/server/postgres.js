//Nécessaire pour la connexion à la BD
const pg = require("pg");
const conString = "postgres://dev:dev@postgres:5432/test";

export const doRequest = async () => {
  //   //connexion à la bd
  //   const client = new pg.Client(conString);
  //   client.connect();
  //   /*Select example*/
  //   var rep = await client.query("SELECT * FROM users");
  //   console.log(rep.rows);
  //   /*Insert example*/
  //   // await client.query({
  //   //   name: "insert beatle",
  //   //   text: "INSERT INTO beatles(name, height, birthday) values($1, $2, $3)",
  //   //   values: ["George", 70, new Date(1946, 02, 14)]
  //   // });
  //   client.end();
  console.log("Do a request");
};
