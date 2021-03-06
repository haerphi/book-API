const {gql} = require("apollo-server-express");
import axios from "axios";
const {DateTime} = require("luxon");

import bd from "../bd/postgresql";

//Schema
export const typeDefs = gql`
    type Book {
        id: Int
        ISBN: String
        title: String
        subTitle: String
        editor: String
        format: String
        langue: String
        couverture: String
        stock: Int
        authors: [Author]
        critiques: [Critique]
    }

    type Author {
        id: Int
        name: String
        books: [Book]
    }

    type User {
        email: String
        name: String
        critiques: [Critique]
        emprunts: [Emprunt]
        avis: [Avis]
    }

    type Critique {
        id: Int
        title: String
        comment: String
        evaluation: String
        user: User
        book: Book
        pertinent: Int
        nonPertinent: Int
    }

    type Emprunt {
        id: Int
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
        book(id: Int!): Book
        books: [Book]

        author(id: Int!): Author
        authors: [Author]

        users: [User]
        user(id: Int): User
        actualUser: User

        critiques: [Critique]
        critique(id: Int!): Critique

        emprunts: [Emprunt]
        empruntsByBook(id: Int!): [Emprunt]
        empruntsByUser(id: Int!): [Emprunt]

        avis: [Avis]
    }

    type Mutation {
        addAuthor(name: String!): Author
        addBook(
            ISBN: String!
            title: String!
            subTitle: String!
            editor: String!
            format: String!
            langue: String!
            couverture: String!
            stock: Int!
            authors: [String]!
        ): Book

        addBookISBN(
            ISBN: String!
            stock: Int!
            langue: String
            format: String
            couverture: String
        ): Book

        addCritique(
            id_book: Int!
            title: String
            comment: String!
            evaluation: Int!
        ): Critique

        addAvisCritique(id_critique: Int!, pertinent: Boolean!): Avis

        addEmprunt(id_book: Int!, id_user: Int!): Emprunt
        #livreRendu
    }
`;

//résolver
export const resolvers = {
    Query: {
        books: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            const books = await bd.from("books");
            return books;
        },
        book: async (parent, args, context) => {
            //A besoin d'être connecter
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            //Retourne un tableau
            const rep = await bd.from("books").where("id", args.id);
            return rep[0];
        },

        authors: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            const rep = await bd.from("authors");
            return rep;
        },
        author: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            const rep = await bd.from("authors").where("id", args.id);
            return rep[0];
        },

        users: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            const rep = await bd.from("users");
            return rep;
        },
        user: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            const rep = await bd.from("users").where("id", args.id);
            return rep[0];
        },

        actualUser: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            return (await bd.from("users").where("id", context.user.id))[0];
        },

        critiques: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            const rep = await bd.from("critiques");
            return rep;
        },

        critique: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            const rep = await bd.from("critiques").where("id", args.id);
            return rep[0];
        },

        emprunts: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            const rep = await bd.from("emprunts");
            return rep;
        },
        //faire emprunts en recherchant livre ou user
        empruntsByBook: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            const rep = await bd.from("emprunts").where("id_book", args.id);
            return rep;
        },
        empruntsByUser: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            const rep = await bd.from("emprunts").where("id_user", args.id);
            return rep;
        },

        avis: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            const rep = await bd.from("avis_critique");
            return rep;
        },
    },
    Mutation: {
        addAuthor: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            if (context.user.role !== "admin") {
                throw new Error("You must be admin");
            }
            await bd("authors").insert({name: args.name});
            const rep = (await bd.from("authors").where("name", args.name))[0];
            return rep;
        },
        addBook: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            if (context.user.role !== "admin") {
                throw new Error("You must be admin");
            }
            //parcours des auteurs
            const tabPromisesAuthors = [];
            for (let i = 0; i < args.authors.length; i++) {
                tabPromisesAuthors.push(
                    bd.from("authors").where("name", args.authors[i]),
                );
            }

            const rep = await Promise.all(tabPromisesAuthors);
            const tabPromiseInsert = [];
            rep.forEach((el, i) => {
                if (el.length < 1) {
                    tabPromiseInsert.push(
                        bd("authors").insert({name: args.authors[i]}),
                    );
                }
            });
            await Promise.all(tabPromiseInsert);

            const auteurs = await bd
                .from("authors")
                .whereIn("name", args.authors);

            //ajout du livre dans la bd
            await bd("books").insert({
                ISBN: args.ISBN,
                title: args.title,
                subTitle: args.subTitle,
                editor: args.editor,
                format: args.format,
                langue: args.langue,
                couverture: args.couverture,
                stock: args.stock,
            });
            const livre = (await bd.from("books").where("ISBN", args.ISBN))[0];
            //lien entre l'auteur et le livre dans la bd
            const tabPromiseBook_has_authors = [];
            for (const element of auteurs) {
                tabPromiseBook_has_authors.push(
                    bd("books_has_authors").insert({
                        id_author: parseInt(element.id),
                        id_book: parseInt(livre.id),
                    }),
                );
            }
            await Promise.all(tabPromiseBook_has_authors);
            return livre;
        },
        addBookISBN: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            if (context.user.role !== "admin") {
                throw new Error("You must be admin");
            }
            const ISBN = args.ISBN.replace(/-/g, "");
            //récupération du livre dans l'API
            let livre = (await axios.get(
                `https://openlibrary.org/api/books?bibkeys=ISBN:${ISBN}&jscmd=data`,
            )).data;
            //suppression des 18 premiers caractères et du dernier
            livre = livre.substring(18);
            livre = livre.substring(0, livre.length - 1);

            if (livre.length < 3) {
                throw new Error(
                    `Cet ISBN n'est pas référencé dans l'API openLibrary.org `,
                );
            }
            //transformation du String en objet
            livre = JSON.parse(livre);
            //Tout l'objet est dans ISBN, ici, on raccourci les requêtes futures en outrepassant automatiquement ce stade ISBN
            livre = livre[`ISBN:${ISBN}`];
            const auteurs = [];
            // Récupération des auteurs définis dans l'objet de l'API
            const tabPromisesAuthors = [];
            for (let i = 0; i < livre.authors.length; i++) {
                tabPromisesAuthors.push(
                    bd.from("authors").where("name", livre.authors[i].name),
                );
            }

            const repPromisesAuthors = await Promise.all(tabPromisesAuthors);
            const tabPromiseInsertedAuthors = [];
            repPromisesAuthors.forEach((element, i) => {
                auteurs.push(livre.authors[i].name);
                // Si l'auteur n'existe pas
                if (element.length < 1) {
                    // On l'insère dans la bd
                    tabPromiseInsertedAuthors.push(
                        bd("authors").insert({name: livre.authors[i].name}),
                    );
                }
            });

            await Promise.all(tabPromiseInsertedAuthors);

            // utile eplus bas pour lié l'auteur au livre via les ID dans la bd "books_has_authors"
            const auteursBD = await bd.from("authors").whereIn("name", auteurs);

            // ajout du livre dans la bd "books"
            await bd("books").insert({
                ISBN,
                title: livre.title,
                subTitle: livre.title.substring(0, 20),
                editor: livre.publishers[0].name,
                format: args.format || "Non renseigné",
                langue: args.langue || "Non renseigné",
                couverture: args.couverture || "Non disponible",
                stock: args.stock,
            });
            const livreBD = (await bd.from("books").where("ISBN", ISBN))[0];

            const tapPromisesbooks_has_authors = [];
            for (const element of auteursBD) {
                tapPromisesbooks_has_authors.push(
                    bd("books_has_authors").insert({
                        id_author: parseInt(element.id),
                        id_book: parseInt(livreBD.id),
                    }),
                );
            }
            await Promise.all(tapPromisesbooks_has_authors);
            return livreBD;
        },
        addEmprunt: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            if (context.user.role !== "admin") {
                throw new Error("You must be admin");
            }
            //vérifier si le livre existe
            const livre = await bd.from("books").where("id", args.id_book);
            if (livre.length < 1) {
                throw new Error(
                    "L'id du livre n'existe pas dans la base de donnée",
                );
            }
            //vérifier si le user existe
            const user = await bd.from("books").where("id", args.id_user);
            if (user.length < 1) {
                throw new Error(
                    "L'id de l'utilisateur n'existe pas dans la base de donnée",
                );
            }

            const retardUser = await bd
                .from("emprunts")
                .where("id_user", args.id_user)
                .where("date_rendu", null);

            //vérifier si l'utilisateur à moins de 5 emprunts
            if (retardUser.length >= 5) {
                throw new Error(
                    `Cette utilisateur a déjà emprunter ${retardUser.length} livres.`,
                );
            }
            //vérifier si le user n'a pas de livre en retard
            retardUser.forEach(el => {
                const dateL = el.date_location;
                const delay = Math.floor((Date.now() - dateL) / 86400000);
                if (delay > 30) {
                    throw new Error("Vous avez un livre en retard.");
                }
            });

            const myDate = DateTime.fromObject(Date.now()).toISODate();

            const emprunt = {
                id_book: args.id_book,
                id_user: args.id_user,
                date_location: args.date || myDate,
            };

            await bd("emprunts").insert(emprunt);
            return emprunt;
        },
        addCritique: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            const id_book = await bd.from("books").where("id", args.id_book);
            if (id_book.length < 1) {
                throw new Error(
                    "Ce livre n'existe pas dans notre base de donnée",
                );
            }
            const com = {
                title: args.title || null,
                comment: args.comment,
                evaluation: args.evaluation,
                id_book: args.id_book,
                id_user: context.user.id,
            };

            //vérifier si l'utilisateur a déjà fait une critique sur le livre

            const tempTab = await bd
                .from("critiques")
                .where("id_user", context.user.id)
                .where("id_book", args.id_book);
            if (tempTab.length < 1) {
                //si non -> insert
                await bd("critiques").insert(com);
            } else {
                //si oui -> update
                await bd("critiques")
                    .where("id_user", context.user.id)
                    .where("id_book", args.id_book)
                    .update(com);
            }

            return com;
        },
        addAvisCritique: async (parent, args, context) => {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            const id_critique = await bd
                .from("critiques")
                .where("id", args.id_critique);
            if (id_critique.length < 1) {
                throw new Error(
                    "Cette critique n'existe pas dans notre base de donnée",
                );
            }
            const avis = {
                id_critique: args.id_critique,
                id_user: context.user.id,
                pertinent: args.pertinent,
            };
            const tempTab = await bd
                .from("avis_critique")
                .where("id_user", context.user.id)
                .where("id_critique", args.id_critique);
            //vérifier si l'utilisateur a déjà poster un avis sur cette critique
            if (tempTab.length < 1) {
                //si non -> insert
                await bd("avis_critique").insert(avis);
            } else {
                //si oui -> update
                await bd("avis_critique")
                    .where("id_user", context.user.id)
                    .where("id_critique", args.id_critique)
                    .update(avis);
            }
            return avis;
        },
    },
    Book: {
        async authors(book) {
            const authorsOfBook = await bd
                .select("id_author")
                .from("books_has_authors")
                .where("id_book", book.id);
            const tab = [];
            authorsOfBook.forEach(el => {
                tab.push(el.id_author);
            });
            const rep = await bd.from("authors").whereIn("id", tab);
            return rep;
        },
        async critiques(book) {
            const rep = await bd.from("critiques").where("id_book", book.id);
            return rep;
        },
    },
    Author: {
        async books(author) {
            const booksOfAuthor = await bd
                .select("id_book")
                .from("books_has_authors")
                .where("id_author", author.id);
            const tab = [];
            booksOfAuthor.forEach(el => {
                tab.push(el.id_book);
            });
            const rep = await bd.from("books").whereIn("id", tab);
            return rep;
        },
    },
    User: {
        async critiques(user) {
            const rep = await bd.from("critiques").where("id_user", user.id);
            return rep;
        },
        async emprunts(user) {
            const rep = await bd.from("emprunts").where("id_user", user.id);
            return rep;
        },
        async avis(user) {
            const rep = await bd
                .from("avis_critique")
                .where("id_user", user.id);
            return rep;
        },
        email(user, args, context) {
            if (!context.user.id) {
                throw new Error(context.user.error);
            }
            if (context.user.role === "admin") {
                return user.email;
            }
            return "you must be admin";
        },
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
        },
    },
    Emprunt: {
        async book(emprunt) {
            return (await bd.from("books").where("id", emprunt.id_book))[0];
        },
        async user(emprunt) {
            return (await bd.from("users").where("id", emprunt.id_user))[0];
        },
        date_location(emprunt) {
            const myDate = DateTime.fromObject(
                emprunt.date_location,
            ).toISODate();
            return myDate;
        },
    },
    Avis: {
        async user(avis) {
            return (await bd.from("users").where("id", avis.id_user))[0];
        },
        async critique(avis) {
            return (await bd
                .from("critiques")
                .where("id", avis.id_critique))[0];
        },
    },
};
