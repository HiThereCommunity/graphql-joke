// @flow

import {
  mutationWithClientMutationId,
  fromGlobalId
} from 'graphql-relay'

import {
    GraphQLNonNull,
    GraphQLID
} from 'graphql'

import {GraphQLTodoItem} from '../objects'
import {TodoItem} from '../../models'

export default mutationWithClientMutationId({
  name: 'DeleteTodoItem',
  inputFields: {
    todoId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    deletedTodoId: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (payload) => payload.id
    },
    deletedTodo: {
      type: new GraphQLNonNull(GraphQLTodoItem),
      resolve: (payload) => payload.todo
    }
  },
  mutateAndGetPayload: async ({todoId, completed}, context, {rootValue}) => {
    const {id} = fromGlobalId(todoId)
    const deletedTodo = await TodoItem.delete(id, rootValue)
    return {
      todo: deletedTodo,
      id: todoId
    }
  }
})
