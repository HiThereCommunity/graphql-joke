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

import config from '../dbConfig.json'

const connector = new PostgresConnector(config)

const createRootValue = (req): RootValue => ({
  db: connector,
  viewer: req.user
})

const app = express()

/**
 * The GraphiQL endpoint
 */
app.use(`/graphiql`, graphqlHTTP(req => ({
  schema: GraphQLSchema,
  graphiql: true,
  rootValue: createRootValue(req),
  formatError: (error) => ({
    message: error.message,
    stack: error.stack.split('\n'),
    locations: error.locations
  })
})
))

/**
 * The single GraphQL Endpoint
 */
app.use('/', graphqlHTTP(req => ({
  schema: GraphQLSchema,
  graphiql: false,
  rootValue: createRootValue(req)
})
))

const environment = process.env.NODE_ENV

var port
switch (environment) {
  case 'production':
    port = 80
    break
  case 'development':
    port = 3000
    break
  default:
    throw new Error(`Unrecognized environment ${String(environment)}`)
}

app.listen(port, function () {
  console.log(`Server running on port ${port}`)
})
