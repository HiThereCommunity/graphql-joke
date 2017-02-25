// @flow

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

import { graphQLErrorFormatter } from './utils';

const createContext = async (): Promise<Context> => {

  const jokeLoader = new DataLoader(ids => batchGetJokes(ids));
  const userLoader = new DataLoader(ids => batchGetUsers(ids));

  /**
   * The viewer is usually retrieved from the access token in the request.
   * To keep this example simple we simulate this by retrieving the user with id 1.
   */
  const viewer = await User.genAuth("1", userLoader);

  if (!viewer) throw new Error("Could not find viewer");
  return {
    loaders: {
      joke: jokeLoader,
      user: userLoader
    },
    viewer
  };
};

const app = express();

/**
 * The GraphiQL endpoint
 */
app.use(
  `/graphiql`,
  graphqlHTTP(async req => ({
    schema,
    graphiql: true,
    context: await createContext(),
    formatError: graphQLErrorFormatter(config.debugMode)
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
    formatError: graphQLErrorFormatter(config.debugMode)
  }))
);

db.sequelize.sync().then(() => {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
});
