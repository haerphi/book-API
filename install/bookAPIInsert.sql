INSERT INTO users (email, name, password) VALUES ('plow@gmail.com', 'plow', 'plow');

INSERT INTO authors (name) VALUES('J. K. Rowling');

INSERT INTO books ("ISBN", title, "subTitle", editor, format, langue, couverture, stock) VALUES ('0-7475-3269-9', 'Harry Potter à l''école des sorciers', 'Le premier', 'Le junior', 'poche', 'FR', 'https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg', 5);
INSERT INTO books_has_authors(id_book, id_author) VALUES (1, 1);

INSERT INTO books ("ISBN", title, "subTitle", editor, format, langue, couverture, stock) VALUES('2-07-052455-8', 'Harry Potter et la Chambre des secrets', '2eme livre', 'Le junior', 'poche', 'FR', 'No img...', 2);
INSERT INTO books_has_authors(id_book, id_author) VALUES (2, 1);

INSERT INTO books ("ISBN", title, "subTitle", editor, format, langue, couverture, stock) VALUES('2-07-052818-9', 'Harry Potter et le Prisonnier d''Azkaban', '3eme livre', 'Le junior', 'poche', 'FR', 'No img...', 0);
INSERT INTO books_has_authors(id_book, id_author) VALUES (3, 1);

INSERT INTO critiques (title, comment, evaluation, id_user, id_book) VALUES ('M''ouai !', 'J''ai préferé le précédent !', 3, 1, 2);