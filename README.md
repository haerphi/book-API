# Book-API

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

## Utilisation de l'API

Route public:

- post `/register` : `{body: {email: string, password: string}}` return une string
- post `/get-token`: `{body: {email: string, password: string}}` return un objet
