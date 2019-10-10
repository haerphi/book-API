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
    name: String
    critiques: [Critique]
    emprunts: [Emprunt]
    avis: [Avis]
  }

  type Critique {
    id: String
    title: String
    comment: String
    evaluation: String
    user: User
    book: Book
    pertinent: Int
    nonPertinent: Int
  }

  type Emprunt {
    id: String
    book: Book
    user: User
    date_location: String
    date_rendu: String
  }

  type Avis {
    pertinent: Boolean
    user: User
    critique: Critique
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

    avis: [Avis]
  }
  type Mutation {
    addAuthor(name: String): Author
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

    critiques: async () => await bd.from("critiques"),
    critique: async (parent, args, context) => {
      const rep = await bd.from("critiques").where("id", args.id);
      return rep[0];
    },

    emprunts: async () => await bd.from("emprunts"),
    //faire emprunts en recherchant livre ou user
    empruntsByBook: async (parent, args, context) => {
      const rep = await bd.from("emprunts").where("id_book", args.id);
      return rep;
    },
    empruntsByUser: async (parent, args, context) => {
      const rep = await bd.from("emprunts").where("id_user", args.id);
      return rep;
    },

    avis: async () => await bd.from("avis_critique")
  },
  Mutation: {
    addAuthor: async (parent, args, context) => {
      await bd("authors").insert({ name: args.name });
      const rep = (await bd.from("authors").where("name", args.name))[0];
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
    },
    async avis(user) {
      return await bd.from("avis_critique").where("id_user", user.id);
    }
  },
  Critique: {
    async book(critique) {
      return (await bd.from("books").where("id", critique.id_book))[0];
    },
    async user(critique) {
      return (await bd.from("users").where("id", critique.id_user))[0];
    },
    async pertinent(critique) {
      return (await bd
        .from("avis_critique")
        .where("id_critique", critique.id)
        .where("pertinent", true)).length;
    },
    async nonPertinent(critique) {
      return (await bd
        .from("avis_critique")
        .where("id_critique", critique.id)
        .where("pertinent", false)).length;
    }
  },
  Emprunt: {
    async book(emprunt) {
      return (await bd.from("books").where("id", emprunt.id_book))[0];
    },
    async user(emprunt) {
      return (await bd.from("users").where("id", emprunt.id_user))[0];
    }
  },
  Avis: {
    async user(avis) {
      return (await bd.from("users").where("id", avis.id_user))[0];
    },
    async critique(avis) {
      return (await bd.from("critiques").where("id", avis.id_critique))[0];
    }
  }
};
