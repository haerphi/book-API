DROP TABLE books_has_authors;
DROP TABLE avis_critique;
DROP TABLE critiques;
DROP TABLE emprunts;
DROP TABLE authors;
DROP TABLE books;
DROP TABLE users;

CREATE TABLE "users" (
  "id" SERIAL UNIQUE,
  "name" varchar UNIQUE,
  "email" varchar UNIQUE,
  "password" text,
  "admin" boolean DEFAULT false
);

CREATE TABLE "books" (
  "id" SERIAL UNIQUE,
  "ISBN" varchar UNIQUE,
  "title" varchar,
  "subTitle" varchar,
  "editor" varchar,
  "format" varchar,
  "langue" varchar,
  "couverture" text,
  "stock" int
);

CREATE TABLE "authors" (
  "id" SERIAL UNIQUE,
  "name" varchar
);

CREATE TABLE "emprunts" (
  "id" SERIAL UNIQUE,
  "id_book" int,
  "id_user" int,
  "date_location" date,
  "date_rendu" date
);

CREATE TABLE "critiques" (
  "id" SERIAL,
  "title" varchar,
  "comment" text,
  "evaluation" int,
  "id_user" int,
  "id_book" int
);

CREATE TABLE "avis_critique" (
  "pertinent" boolean,
  "id_user" int,
  "id_critique" int
);

CREATE TABLE "books_has_authors" (
  "id_author" int,
  "id_book" int
);

ALTER TABLE "emprunts" ADD FOREIGN KEY ("id_book") REFERENCES "books" ("id");

ALTER TABLE "emprunts" ADD FOREIGN KEY ("id_user") REFERENCES "users" ("id");

ALTER TABLE "critiques" ADD FOREIGN KEY ("id_user") REFERENCES "users" ("id");

ALTER TABLE "critiques" ADD FOREIGN KEY ("id_book") REFERENCES "books" ("id");

ALTER TABLE "avis_critique" ADD FOREIGN KEY ("id_user") REFERENCES "users" ("id");

ALTER TABLE "avis_critique" ADD FOREIGN KEY ("id_critique") REFERENCES "critiques" ("id");

ALTER TABLE "books_has_authors" ADD FOREIGN KEY ("id_author") REFERENCES "authors" ("id");

ALTER TABLE "books_has_authors" ADD FOREIGN KEY ("id_book") REFERENCES "books" ("id");
