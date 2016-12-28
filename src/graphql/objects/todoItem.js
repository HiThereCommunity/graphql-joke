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

import {
  globalIdField
} from 'graphql-relay'

import {
  nodeInterface
} from '../relay'

import {TodoItem} from '../../models'

import type {GraphQLIDOutput} from '../type'

export default new GraphQLObjectType({
  name: 'TodoItem',
  description: 'Represents a single todo item',
  fields: () => ({
    id: globalIdField(
          'TodoItem',
          (todoItem: TodoItem): GraphQLIDOutput => todoItem.getId()
        ),
    title: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (todoItem: TodoItem): string => todoItem.getTitle()
    },
    completed: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (todoItem: TodoItem): boolean => todoItem.getCompleted()
    }
  }),
    // Relay will use this function to determine if an object in your system is
    // of a particular GraphQL type
  isTypeOf: function (obj) { return obj instanceof TodoItem },
  interfaces: [ nodeInterface ]
})
