const graphql = require("graphql");
const lodash = require("lodash");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;

//dummy data
var Books = [
  { name: "Harry Potter 1", genre: "Enfant", id: "1", authorId: "1" },
  { name: "Harry Potter 2", genre: "Jeunesse", id: "2", authorId: "2" },
  { name: "Harry POtter 3", genre: "Fantastique", id: "3", authorId: "2" },
  { name: "Harry POtter 4", genre: "Fantastique", id: "4", authorId: "2" },
  { name: "Harry POtter 5", genre: "Fantastique", id: "5", authorId: "3" },
  { name: "Harry POtter 6", genre: "Fantastique", id: "6", authorId: "3" },
  { name: "Harry POtter 7", genre: "Fantastique", id: "7", authorId: "3" }
];

var authors = [
  { name: "Simon", age: "27", id: "1" },
  { name: "Phil", age: "22", id: "2" },
  { name: "Dydy", age: "18", id: "3" }
];

//Schema pour les books

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        return lodash.find(authors, { id: parent.authorId });
      }
    }
  })

  //utilisation de fields car multipleTypes en rapport les uns avec les autres.
  //On met une fonction pour pouvoir appeller cette const avant, c'est surtout utile pour l'instant pour  authorType
});

//Schema pour les authors

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return lodash.filter(Books, { authorId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    //sortie books avec possibilité liaison auteur
    book: {
      // quand quelqu'un recher un book, on arrive ici
      type: BookType, //le type de data que on recherche, défini juste au dessus
      args: { id: { type: GraphQLString } }, //avec la requête book, je vais récupérer un id
      resolve(parent, args, ctx) {
        // à a réception de et ID, on va passer à cette fonction, qui va utiliser l'id et aller chercher le livre lié
        //
        //code to get data from db
        console.log(ctx.headers);
        return lodash.find(Books, { id: args.id });

        //
      }
    },

    //Sortie author avec pôssibilité liaison livre
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return lodash.find(authors, { id: args.id });
      }
    },

    //Listage des tous les auteurs
    authors: {
      type: new GraphQLList(AuthorType),

      resolve(parent, args) {
        return authors;
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Books;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  //défini le schéma autorisé à l'user lors de ses requêtes

  //
  //initial RootQuery
  //
  query: RootQuery
});
