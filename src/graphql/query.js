// @flow
import {
  GraphQLObjectType,
  GraphQLNonNull
} from 'graphql'

import { nodeField } from './relay'

import {TodoList} from '../models'
import {GraphQLTodoList} from './objects'

import type {RootValue} from '../types'

export default new GraphQLObjectType({
  name: 'Query',
  description: 'All the queries that can be used to retrieve data',
  fields: () => ({
    node: nodeField,
    todoList: {
      type: new GraphQLNonNull(GraphQLTodoList),
      description: 'The list of todo items',
      resolve: (root: RootValue): TodoList => new TodoList(root)
    }
  })
})
