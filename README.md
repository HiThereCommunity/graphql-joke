# graphql-todo-list-reference

[![Build Status](https://travis-ci.org/HiThereCommunity/graphql-todo-list-reference.svg?branch=master)](https://travis-ci.org/HiThereCommunity/graphql-todo-list-reference)
Best practices for implementing a graphQL based on an example todo-list node.js server app

WORK IN PROGRESS

## Getting Started

### Installing dependencies
Install the dependencies by running the following command from the terminal in the directory of the project.

```
$ npm install
```

### Development

Run the server in development on `linux` using the following command

```
$ npm run start
```

**Note:** Do not forget to set the following environmental variables of your MySQl/PostgresQL db before starting the server:

* `DB_HOST`
* `DB_USER`
* `DB_PASSWORD`
* `DB_DATABASE`

For windows run

```
$ npm run startWindows
```

When running the node server in development [Nodemon](https://github.com/remy/nodemon) will be turned on.
Nodemon will watch for any file changes in the project and automatically restart the server.

> The server runs on port 3000 in development

### Production

In production we precompile all the files in the `/src` directory to ES5 syntax using `babel`. These precompiled files are then moved to the `/dist` folder. Precompile the files using the following command

```
$ npm run build
```

To run the precompiled assets in production on `linux` run the command

```
$ npm run serve
```

For `windows` run the command

```
$ npm run startWindows
```

> The server runs on port 80 in production.

### Testing

#### Mocha

All the tests are performed using `mocha` and assertions are made using `chai`. Tests are located in folders
under the name `__tests__`.

Note, `mocha` has been setup to import modules contained in the `/resources` directory.


Run the `mocha` tests using the command

```
$ npm run test
```

#### Flow

This project includes the static type checking tool [Flow](https://flowtype.org/). Add `// @flow`
at top of any file that you want `flow` to check.

Run the `flow` type check using the command

```
$ npm run check
```

## The GraphQL API

> The examples queries below assume that the server is running in development on port 3000.

### Writing queries
The graphQL API can be accessed by under the path `/`. The `query` is contained in the query-string
of the request.

```
http://localhost:3000/?query={query}
```

### GraphiQL

In addition, you can also use [GraphiQL](https://github.com/graphql/graphiql) for
 writing queries in an IDE environment. GraphiQL can be accessed using the URL path `/graphiql`

 ```
http://localhost:3000/graphiql
 ```
