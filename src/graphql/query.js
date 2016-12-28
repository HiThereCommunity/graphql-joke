// @flow
import {
  GraphQLObjectType,
  GraphQLNonNull
} from 'graphql'

import {
  nodeField,
  GraphQLTodoList
} from './objects'

import {TodoList} from '../models'
import type {RootValue} from '../types'

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The query root.',
  fields: () => ({
    node: nodeField,
    todoList: {
      type: new GraphQLNonNull(GraphQLTodoList),
      description: 'The list of todo items',
      resolve: (root: RootValue): TodoList => new TodoList(root)
    }
  })
})
