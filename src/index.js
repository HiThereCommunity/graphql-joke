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

import express from "express";
import graphqlHTTP from "express-graphql";
import { schema } from "./graphql";
import type { Context } from "./graphql";
import { User } from "./models";
import db from "./database";

import { batchGetJokes, batchGetUsers} from "./loaders";
import config from "./config";
import DataLoader from "dataloader";

import formatErrorGraphQL from './utils/GraphQLErrorFormatter';

const createContext = async (): Promise<Context> => {

  const jokeLoader = new DataLoader(ids => batchGetJokes(ids));
  const userLoader = new DataLoader(ids => batchGetUsers(ids));

  //We assume that a user with id 1 exists.
  const user = await User.genAuth("1", userLoader);

  if (!user) throw new Error("Could not find user");
  return {
    loaders: {
      joke: jokeLoader,
      user: userLoader
    },
    viewer: user
  };
};

const app = express();

const formatError = error => {
  if (config.environment === "development") {
    return {
      message: error.message,
      stack: error.stack.split("\n"),
      locations: error.locations,
      path: error.path
    };
  } else if (config.environment === "production") {
    return {
      message: error.message,
      locations: error.locations,
      path: error.path
    };
  }
};

/**
 * The GraphiQL endpoint
 */
app.use(
  `/graphiql`,
  graphqlHTTP(async req => ({
    schema,
    graphiql: true,
    context: await createContext(),
    formatError: formatErrorGraphQL()
  }))
);

/**
 * The single GraphQL Endpoint
 */
app.use(
  "/",
  graphqlHTTP(async req => ({
    schema,
    graphiql: false,
    context: await createContext(),
    formatError: formatErrorGraphQL()
  }))
);

db.sequelize.sync().then(() => {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
});
