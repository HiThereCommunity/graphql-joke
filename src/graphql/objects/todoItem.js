// @flow

/**
 * Created by dirk-janrutten on 13/08/16.
 */

import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLNonNull
} from 'graphql'
import {globalIdField} from 'graphql-relay'

import {nodeInterface} from './relayNode'
import {TodoItem} from '../../models'
import type {ID} from '../type'

export default new GraphQLObjectType({
  name: 'TodoItem',
  description: 'Represents a todo item.',
  fields: () => ({
    id: globalIdField(
          'TodoItem',
          (todoItem: TodoItem): ID => todoItem.id
        ),
    title: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (todoItem: TodoItem): string => todoItem.title
    },
    completed: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (todoItem: TodoItem): boolean => todoItem.completed
    }
  }),
    // Relay will use this function to determine if an object in your system is
    // of a particular GraphQL type
  isTypeOf: function (obj) { return obj instanceof TodoItem },
  interfaces: [ nodeInterface ]
})
