const { gql } = require("apollo-server-express");
const lodash = require("lodash");

//dummy
var books = [
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

//Schema
export const typeDefs = gql`
  type Book {
    id: String
    name: String
    author: Author
  }

  type Author {
    name: String
    age: String
    id: String
  }

  # toute les futures queries
  type Query {
    author(id: String): Author
    authors: [Author]
    book(id: String): Book
    books: [Book]
  }
`;

//résolver
export const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors,
    author: (parent, args, context) => {
      if (!context.user.id) {
        throw new Error(context.user.error);
      }
      return lodash.find(authors, { id: args.id });
    },
    book: (parent, args, context) => {
      //A besoin d'être connecter
      if (!context.user.id) {
        throw new Error(context.user.error);
      }
      return lodash.find(books, { id: args.id });
    }
  },
  Book: {
    author(book) {
      return lodash.find(authors, { id: book.authorId });
    }
  }
};
