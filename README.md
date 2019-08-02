# Módulo KC NodeJS

Repositorio usado para realizar la práctica del tercer módulo del bootcamp -> NodeJS

## nodepop

> express nodepop -ejs
> npm i

- MondoDB: To start a local server execute `mongod --dbpath='/home/grusite/data/db'`
- To init the DB execute `npm run installDB`
- To start the server execute `npm run dev`
- To start the server with the init `npm run initDB-dev`

* models -> where I store the DB model
* controllers -> where I store the route controllers
* lib -> where I store somo db functions

### API Methods

#### advertisement list

http://localhost:3000/apiv1/anuncios

#### Parameters:

tags:
limit: numeric. Limits the number of results returned

####
