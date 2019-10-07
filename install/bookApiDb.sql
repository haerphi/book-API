drop table books_has_authors;
drop table books;
drop table authors;
drop table users;

CREATE TABLE "users" (
  "id" SERIAL UNIQUE,
  "email" varchar UNIQUE,
  "password" text,
  "admin" boolean,
  "token" text UNIQUE,
  "tokenDate" date
);

CREATE TABLE "books" (
  "id" SERIAL UNIQUE,
  "ISBN" varchar UNIQUE,
  "title" varchar,
  "subTitle" varchar,
  "editor" int,
  "format" varchar,
  "langue" int,
  "couverture" text,
  "stock" int
);

CREATE TABLE "authors" (
  "id" SERIAL UNIQUE,
  "name" varchar
);

CREATE TABLE "books_has_authors" (
  "id_author" int,
  "id_book" int
);

ALTER TABLE "books_has_authors" ADD FOREIGN KEY ("id_author") REFERENCES "authors" ("id");

ALTER TABLE "books_has_authors" ADD FOREIGN KEY ("id_book") REFERENCES "books" ("id");
