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
import GraphQLSchema from './graphql'
import type {RootValue} from './types'
import {PostgresConnector} from './connectors'

import config from './config'

const connector = new PostgresConnector(config.db)

const createRootValue = (req): RootValue => ({
  db: connector,
  viewer: req.user
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
  schema: GraphQLSchema,
  graphiql: true,
  rootValue: createRootValue(req),
  formatError
})))

/**
 * The single GraphQL Endpoint
 */
app.use('/', graphqlHTTP(req => ({
  schema: GraphQLSchema,
  graphiql: false,
  rootValue: createRootValue(req),
  formatError
})))

app.listen(config.port, function () {
  console.log(`Server running on port ${config.port}`)
})
