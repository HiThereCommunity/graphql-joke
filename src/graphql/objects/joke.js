// @flow

/**
 * Created by dirk-janrutten on 13/08/16.
 */

import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLNonNull
} from 'graphql'
import {globalIdField} from 'graphql-relay'

import {nodeInterface} from './relayNode'
import {Joke} from '../../models'
import type {ID} from '../type'

export default new GraphQLObjectType({
  name: 'Joke',
  description: 'Represents a joke.',
  fields: () => ({
    id: globalIdField(
          'Joke',
          (joke: Joke): ID => joke.id
        ),
    text: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (joke: Joke): string => joke.text
    },
    funnyLevel: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (joke: Joke): number => joke.funnyLevel
    }
  }),
    // Relay will use this function to determine if an object in your system is
    // of a particular GraphQL type
  isTypeOf: function (obj) { return obj instanceof Joke },
  interfaces: [ nodeInterface ]
})
