# Módulo KC NodeJS

Repositorio usado para realizar la práctica del tercer módulo del bootcamp -> NodeJS

## nodepop

- MondoDB: To start a local server execute `mongod --dbpath='/home/grusite/data/db'`
- To init the DB execute `npm run installDB`
- To init the worker that create image thumbnails: `node services/thumbnailWorker.js`
- To start the server execute `npm run dev`
- To execute linter in all files `npm run linter`
- To start the server with the DB formated and the linter `npm run initDB-dev`

* models -> where I store the DB model
* controllers -> where I store the route controllers
* locales -> where I store languages dictionary
* public -> all necesary to interact with frontal made by EJS
* services -> services that other part of the app will use
* .env -> file with user information. The person who runs the code will need to refill the data

## EJS - Front

- [http://localhost:3000/register](http://localhost:3000/register)
  - Page to register an user. Once registered, it will send an email to the user with a Link to the url with the token. The locale selection is at the bottom
- [http://localhost:3000/login](http://localhost:3000/login)
  - Page that makes user login. It will return the <b>JWT Token</b>. The locale selection is at the bottom
- [http://localhost:3000/apiv1/anuncios](http://localhost:3000/apiv1/anuncios)
  - Page with the user advertisements. The user must have been registered, verified and logged (in this order). The locale selection is at the header

## Notes

<b>To start the app the worker must be started</b> `node services/thumbnailWorker.js`.

I have made the server to be ready to register, send email to verify the same, verify the user, resend an email with the verification token and change the user password. I have only implemented login and register EJS view, so the rest could be only tested using <b>Postman</b>.

## Postman Tests

1. POST to [http://localhost:3000/register](http://localhost:3000/register):

   - Body x-www-form-urlencoded
   - name
   - email
   - password

2. Open Mailtrap and login with your user. Get user and password and copy in .env file (you must create it first)

3. Check mail and get the token in it (http://localhost:3000/confirm/:tokenNumber)

4. POST to [http://localhost:3000/register/verify](http://localhost:3000/register/verify):

   - token from the url

5. POST to [http://localhost:3000/login](http://localhost:3000/login):

   - email from the register
   - password from the register

6. Store the token given in the login response

7. GET to [http://localhost:3000/apiv1/anuncios](http://localhost:3000/apiv1/anuncios):

   - Set Authorization Bearer Token and copy the token stored in the last step

8. The rest endopoints related to /apiv1/anuncios will need the authorization header

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
