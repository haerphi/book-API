# Book-API

## Utilisation

Cette API vous permet de gérer votre bibliothèque en temps qu'admin, et de la consulter en temps qu'utilisateur enregistré.

Un User a la possibilté de consulter la listes des livres, il peut se faire prêter un mawimum de 5 livres pendant 1 mois.
Il peut égaement noté les livres, leurs laisser des commentaires, et donner donner un avis sur les commentaires des autres utilisateurs.

Un Admin peut en plus, encoder des nouveaux livres, soit manuellement, soit via leur ISBN, des nouveaux auteurs, et permettre à des utilisateurs d'emprunter des ouvrages.

## Build/Publish

- clone du projet et se déplacer dans le dossier du projet
- installation des dépendances : `npm install`
- build du projet : `npm run build`
- Dossier à publier : `npm run start`
  Acutuellement, la publication ne peut-être fonctionnel car la base de donnée est en local via Docker.

## Installation dev'

- clone du projet et se déplacer dans le dossier du projet
- installation des dépendances : `npm install`
- build du projet : `npm run work:server`
- dans un autre terminal : `docker-compose up`
- Don't forget to pick

## Utilisation de l'API

Route public:

- post `/register` : `{body: {email: string, password: string, name: string}}` return une string
- post `/get-token`: `{body: {email: string, password: string}}` return un objet

Route membre:

- get `/graphql`: accès aux bases de données pour les consulter.

## Possibilités de requêtes: 

* user 
  * email
  * name
  * avis 
    * pertinent
  * emprunt
    * book
      * title
      * authors
        * name
        * books 
          * title

* book(id: )
  * title
  * subTitle 
  * editor
  * format 
  * langue 
  * stock

* actualUser
  * ...
  * ...
  
Et bien d'autres, je vous laisse explorer le code pour trouver toutes les requêtes possibles.

## Possibilité de mutation 

* addAuthor
  * name: String (obligatoire)

* addBook
  * ISBN: String (obligatoire)
  * title: String (obligatoire)
  * subTitle: String (obligatoire)
  * editor: String (obligatoire)
  * format: String (obligatoire)
  * langue: String (obligatoire)
  * couverture: String (obligatoire)
  * stock: String (obligatoire)
  * authors: tableau de String (obligatoire)

NB: il est possible qu'un livre aie plusieurs auteurs.

* addBookISBN
  * ISBN: String (obligatoire)
  * stock: Int(obligatoire)
  * langue: String (optionnel)
  * format: String (optionnel)
  * couverture: String (optionnel)
  
NB:  * Si un auteur d'un livre encodé en ISBN n'existe pas dans la base de données, l'API le crée automatiquement. 
     * Il est possible que l'API que nous utilisons comme source d'ISBN ne connaisse pas votre livre, dans ce cas, vous devrez l'encoder manuellement avec la mutation addBook (cf ci-dessus)

* addCritique
  * id_book: Int (obligatoire)
  * title: String (optionnel)
  * comment: String (obligatoire)
  * evaluation: Int (obligatoire)

* addAvisCritique
  * id_critique: Int (obligatoire)
  * pertinent: Boolean (obligatoire)

* addEmprunt
  * id_book: Int (obligatoire)
  * id_user: Int (obligatoire)

NB: les livres empruntés sont datés comme tels au moment de l'encodage de l'emprunt. Cela peut avoir un impact si vous ne faites pas cet encodage le jour même de l'emprunt.

Il est important de respecter ces schémas pour encoder vos mutations.


## Accès à l'API

Vous pouvez également trouver notre API en ligne à l'adresse :
    https://book-api-simphi.herokuapp.com/graphql

Pour pouvoir faire des query, vous devez utiliser POSTMAN pour créer un compte et générer un TOKEN.

Dans POSTMAN, en méthode POST, à l'adresse 

    https://book-api-simphi.herokuapp.com/register
    
Avec dans Body un code de type 

    { 
       "name": "exemple",
       "email": "exemple@gmail.com",
       "password":"password"
    }
    
Ensuite ouvrez un nouvel onglet et, toujours dans POSTMAN, à l'adresse

    https://book-api-simphi.herokuapp.com/get-token
    
Dans Header, dans la colonne KEY, entrez Content-Type et dans value, application/json
Dans Body, mettre le code

    {
      "email":"exemple@gmail.com",
      "password":"password"
    }

De la, vous obtiendrez un token que vous devez copiez dans l'onglet HTTP HEADERS (en bas à gauche) sous la forme

    {
      "authorization": "Bearer [votre token]"
    }

Ainsi vous pourrez faire les requêtes et les mutations comme expliqué plus haut.
      
      
#### Crédit

API faite dans le cadre d'un projet BeCode part Philippe Haerens et Simon Jolet.

Enjoy
