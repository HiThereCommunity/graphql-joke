# GraphQL Joke API

[![Build Status](https://travis-ci.org/HiThereCommunity/graphql-joke.svg?branch=master)](https://travis-ci.org/HiThereCommunity/graphql-joke)
Best practices for implementing graphQL based on a joke API example in node.js.

## Getting Started

### Installing dependencies
Install the dependencies by running the following command from the terminal in the directory of the project.

```
$ yarn
```

### Development

Run the server in development on `linux` using the following command

```
$ npm run start
```

**Note:** Do not forget to set the following environmental variables of your PostgresQL db before starting the server:

* `DB_PASSWORD`: The password of the database
* `DB_DATABASE`: The name of the database


When running the node server in development [Nodemon](https://github.com/remy/nodemon) will be turned on.
Nodemon will watch for any file changes in the project and automatically restart the server.

### Production

To compile the files run the command:


```
$ npm run build
```

Next, start the production server using the command:

```
$ npm run serve
```

**Note:** Do not forget to set the following environmental variables of your PostgresQL db before starting the server:

* `DB_HOST`: The host address of the database
* `DB_USER`: The user of the database
* `DB_PASSWORD`: The password of the database
* `DB_DATABASE`: The name of the database

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
