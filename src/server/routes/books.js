import PG from "../postgres";
export const booksRoute = async ctx => {
  const books = await PG.select("ISBN", "title").from("books");
  //GRAPHQL
  ctx.body = books;
};
