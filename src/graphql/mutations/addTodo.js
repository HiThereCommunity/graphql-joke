// @flow

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import {
    GraphQLString,
    GraphQLNonNull
} from 'graphql'

import {GraphQLTodoItem} from '../objects'
import {TodoItem} from '../../models'

export default mutationWithClientMutationId({
  name: 'AddTodoItem',
  description: 'Add a new todo item.',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    newTodo: {
      type: new GraphQLNonNull(GraphQLTodoItem),
      resolve: (payload) => payload.todo
    }
  },
  mutateAndGetPayload: async ({title}, context, {rootValue}) => {
    const newTodo = await TodoItem.write(title, rootValue)
    return {
      todo: newTodo
    }
  }
})
