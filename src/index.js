// @flow
/**
 * Copyright (c) 2016, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "babel-polyfill";

import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from "./graphQL";
const app = express();

import connector from "./connectDB";

import PostgresConnector from "./connector";

let config = require("./../dbConfig.json");

let postgres = new PostgresConnector(config);


/**
 * The GraphiQL endpoint
 */
app.use(`/graphiql`, graphqlHTTP(req => ({
      schema: schema,
      graphiql: true,
    rootValue: connector
    })
));

/**
 * The single GraphQL Endpoint
 */
app.use('/', graphqlHTTP(req => ({
      schema: schema,
      graphiql: false,
      context: connector
    })
));

const environment = process.env.NODE_ENV;

var port;
switch(environment){
    case "production":
        port = 80;
        break;
    case "development":
        port = 3000;
        break;
    default:
        throw new Error(`Unrecognized environment ${environment}`);
}

app.listen(port, function () {
    console.log(`Server running on port ${port}`);
});