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
import type RootValue from "./graphQL/types";
import {TodoItemDB} from "./graphQL/connectors";

let todoDB: TodoItemDB = new TodoItemDB();

const createRootValue = (req): RootValue => ({
    db: {todo: todoDB},
    viewer: req.user
});

app.use((req, res, next)=> {

    if (req.query.access_token === "abcdef") {
        req.user = {
            id: "1234"
        };
        next();
    }
    else {
        return res.status(401).json({error: `Authentication error occurred, enter "abcdef" in the querystring under key "access_token" to get access.`});
    }
});

/**
 * The GraphiQL endpoint
 */
app.use(`/graphiql`, graphqlHTTP(req => ({
        schema: schema,
        graphiql: true,
        rootValue: createRootValue(req)
    })
));


/**
 * The single GraphQL Endpoint
 */
app.use('/', graphqlHTTP(req => ({
      schema: schema,
      graphiql: false,
      rootValue: createRootValue(req)
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