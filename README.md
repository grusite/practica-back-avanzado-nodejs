# Módulo KC NodeJS

Repositorio usado para realizar la práctica del tercer módulo del bootcamp -> NodeJS

## nodepop

- MondoDB: To start a local server execute `mongod --dbpath='/home/grusite/data/db'`
- To init the DB execute `npm run installDB`
- To start the server execute `npm run dev`
- To execute linter in all files `npm run linter`
- To start the server with the DB formated and the linter `npm run initDB-dev`

* models -> where I store the DB model
* controllers -> where I store the route controllers
* locales -> where I store languages dictionary
* public -> all necesary to interact with frontal made by EJS
* services -> services that other part of the app will use

## EJS - Front

- [http://localhost:3000/register](http://localhost:3000/register)
  - PAge to register an user. Once registered, the
- [http://localhost:3000/login](http://localhost:3000/login)
  - Page that makes user login. It will return the <b>JWT Token</b>
- [http://localhost:3000/apiv1/anuncios](http://localhost:3000/apiv1/anuncios)

### API Methods

#### advertisement list

http://localhost:3000/apiv1/anuncios

#### Parameters:

With no parameters, it will return all advertisement
aditionally, you can add any filter in the URL:

start: numeric. Skip the number given in the result returned
limit: numeric. Limits the number of results returned
fields: string. Selects the fields especified in the query
sort: string. Sorts the query by the criteria given in the query
name: string. Returns the ads that starts with the name given
tag: string. Returns the ads with the tags given
solg: string. Returns the ads if it for sold or to buy
price: string. Returns the ads with the filter given in price

#### advertisement by id

http://localhost:3000/apiv1/anuncios/:id

#### create an ad

http://localhost:3000/apiv1/anuncios/

data {
name: "name",
sold: true|false,
price: number,
picture: path,
tags: tags
}

#### update an ad

http://localhost:3000/apiv1/anuncios/:id

dataToUpdate {
name: "name",
sold: true|false,
price: number,
picture: path,
tags: tags
}

#### delete an advertisement by id

http://localhost:3000/apiv1/anuncios/:id

#### tags available

http://localhost:3000/apiv1/anuncios/tags
