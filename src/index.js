// @flow
/**
 * Copyright (c) 2016, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'babel-polyfill'

import express from 'express'
import graphqlHTTP from 'express-graphql'
import { schema, type Context } from './graphql'
import {TodoItemConnector, connect} from './connectors'

import config from './config'

const sequelize = connect(config.db);
sequelize.sync({force: false});

const createContext = (): Context => ({
  todoItemConnector: new TodoItemConnector(sequelize),
})

const app = express()

const formatError = (error) => {
  if (config.environment === 'development') {
    return {
      message: error.message,
      stack: error.stack.split('\n'),
      locations: error.locations,
      path: error.path
    }
  } else if (config.environment === 'production') {
    return {
      message: error.message,
      locations: error.locations,
      path: error.path

    }
  }
}

/**
 * The GraphiQL endpoint
 */
app.use(`/graphiql`, graphqlHTTP(req => ({
  schema,
  graphiql: true,
  context: createContext(),
  formatError
})))

/**
 * The single GraphQL Endpoint
 */
app.use('/', graphqlHTTP(req => ({
  schema,
  graphiql: false,
  rootValue: createContext(),
  formatError
})))

app.listen(config.port, function () {
  console.log(`Server running on port ${config.port}`)
})
