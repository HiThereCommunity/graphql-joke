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
import { schema } from './graphql'
import type {Context} from './graphql'
import { TodoItemConnector, UserConnector, connect } from './connectors'
import { User } from './models'

import config from './config';
const sequelize = connect(config.db);
sequelize.sync({force: false});


const createDBUser = async (sequalize): Promise<User> => {

  const userConnector = new UserConnector(sequelize);
  let user = await sequelize.models.user.findOne({id: 1});
  if (!user) user = await sequelize.models.user.create({name: 'Bob', id: 1});

  return new User(user, userConnector);
}

const createContext = async (): Promise<Context> => {
  let user = await createDBUser(sequelize);
  return {
    todoItemConnector: new TodoItemConnector(sequelize),
    viewer: user
  }
}

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
app.use(`/graphiql`, graphqlHTTP(async req => ({
  schema,
  graphiql: true,
  context: await createContext(),
  formatError
})))

/**
 * The single GraphQL Endpoint
 */
app.use('/', graphqlHTTP(async req => ({
  schema,
  graphiql: false,
  context: await createContext(),
  formatError
})))

app.listen(config.port, function () {
  console.log(`Server running on port ${config.port}`)
})
