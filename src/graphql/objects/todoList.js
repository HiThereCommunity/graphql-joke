// @flow

import {
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField,
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray
} from 'graphql-relay'

import {
  nodeInterface
} from './relayNode'

import GraphQLTodoItem from './todoItem'
import {TodoList} from '../../models'
import type {GraphQLIDOutput} from '../type'

let {connectionType: TodoItemConnection} =
  connectionDefinitions({nodeType: GraphQLTodoItem})

export default new GraphQLObjectType({
  name: 'TodoList',
  description: 'Represents the list of todo items.',
  fields: () => ({
    id: globalIdField(
        'TodoList',
        (todoList: TodoList): GraphQLIDOutput => todoList.getId()
      ),
    items: {
      type: TodoItemConnection,
      description: 'All the todo items.',
      args: connectionArgs,
      resolve: (todoList: TodoList, args) => connectionFromPromisedArray(todoList.getAll(), args)
    },
    completed: {
      type: TodoItemConnection,
      description: 'The completed todo items.',
      args: connectionArgs,
      resolve: (todoList: TodoList, args) => connectionFromPromisedArray(todoList.getCompleted(), args)
    },
    active: {
      type: TodoItemConnection,
      description: 'The active todo items.',
      args: connectionArgs,
      resolve: (todoList: TodoList, args) => connectionFromPromisedArray(todoList.getActive(), args)
    }
  }),
  // Relay will use this function to determine if an object in your system is
  // of a particular GraphQL type
  isTypeOf: function (obj) { return obj instanceof TodoList },
  interfaces: [ nodeInterface ]
})
