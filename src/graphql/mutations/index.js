// @flow

import {GraphQLObjectType} from 'graphql'
import addJoke from './addJoke'
import updateJoke from './updateJoke'
import deleteJoke from './deleteJoke'

export default new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root query for implementing GraphQL mutations.',
  fields: () => ({
    addJoke,
    updateJoke,
    deleteJoke
  })
})
