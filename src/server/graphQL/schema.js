const { gql } = require("apollo-server-express");
const lodash = require("lodash");

import bd from "../bd/postgresql";

//Schema
export const typeDefs = gql`
  type Book {
    id: Int
    ISBN: String
    title: String
    subTitle: String
    editor: Int
    format: String
    langue: Int
    couverture: String
    stock: Int
    authors: [Author]
    critiques: [Critique]
  }

  type Author {
    id: String
    name: String
    books: [Book]
  }

  type User {
    id: String
    email: String
    critiques: [Critique]
    emprunts: [Emprunt]
  }

  type Critique {
    id: String
    title: String
    comment: String
    evaluation: String
    user: User
    book: Book
  }

  type Emprunt {
    id: String
    book: Book
    user: User
    date_location: String
    date_rendu: String
  }

  # toute les futures queries
  type Query {
    book(id: String!): Book
    books: [Book]

    author(id: String!): Author
    authors: [Author]

    users: [User]
    user(id: String): User

    critiques: [Critique]
    critique(id: String!): Critique
    emprunts: [Emprunt]
    empruntsByBook(id: String!): [Emprunt]
    empruntsByUser(id: String!): [Emprunt]
  }
`;

//résolver
export const resolvers = {
  Query: {
    books: async () => await bd.from("books"),
    book: async (parent, args, context) => {
      //A besoin d'être connecter
      if (!context.user.id) {
        throw new Error(context.user.error);
      }
      //Retourne un tableau
      const rep = await bd.from("books").where("id", args.id);
      return rep[0];
    },

    authors: async () => await bd.from("authors"),
    author: async (parent, args, context) => {
      if (!context.user.id) {
        throw new Error(context.user.error);
      }
      const rep = await bd.from("authors").where("id", args.id);
      return rep[0];
    },

    users: async () => await bd.from("users"),
    user: async (parent, args, context) => {
      if (!context.user.id) {
        throw new Error(context.user.error);
      }
      const rep = await bd.from("users").where("id", args.id);
      return rep[0];
    },

    critiques: async () => await bd.from("critique"),
    critique: async (parent, args, context) => {
      const rep = await bd.from("critique").where("id", args.id);
      return rep[0];
    },

    emprunts: async () => await bd.from("emprunts"),
    //faire emprunts en recherchant livre ou user
    empruntsByBook: async (parent, args, context) => {
      const rep = await bd.from("emprunts").where("id_book", args.id_book);
      return rep;
    },
    empruntsByUser: async (parent, args, context) => {
      const rep = await bd.from("emprunts").where("id_user", args.id_user);
      return rep;
    }
  },
  Book: {
    async authors(book) {
      const authorsOfBook = await bd
        .select("id_author")
        .from("books_has_authors")
        .where("id_book", book.id);
      let tab = [];
      authorsOfBook.forEach(el => {
        tab.push(el.id_author);
      });
      return await bd.from("authors").whereIn("id", tab);
    },
    async critiques(book) {
      return await bd.from("critiques").where("id_book", book.id);
    }
  },
  Author: {
    async books(author) {
      const booksOfAuthor = await bd
        .select("id_book")
        .from("books_has_authors")
        .where("id_author", author.id);
      let tab = [];
      booksOfAuthor.forEach(el => {
        tab.push(el.id_book);
      });
      return await bd.from("books").whereIn("id", tab);
    }
  },
  User: {
    async critiques(user) {
      return await bd.from("critiques").where("id_user", user.id);
    },
    async emprunts(user) {
      return await bd.from("emprunts").where("id_user", user.id);
    }
  },
  Critique: {
    async book(critique) {
      return (await bd.from("books").where("id", critique.id_book))[0];
    },
    async user(critique) {
      return (await bd.from("users").where("id", critique.id_user))[0];
    }
  },
  Emprunt: {
    async book(emprunt) {
      return (await bd.from("books").where("id", emprunt.id_book))[0];
    },
    async user(emprunt) {
      return (await bd.from("users").where("id", emprunt.id_user))[0];
    }
  }
};
