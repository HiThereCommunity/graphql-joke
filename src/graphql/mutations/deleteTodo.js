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

type Payload = {
  todo: TodoItem
}

export default mutationWithClientMutationId({
  name: 'DeleteTodoItem',
  description: 'Delete a todo item.',
  inputFields: {
    todoId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    todo: {
      type: new GraphQLNonNull(GraphQLTodoItem),
      description: "The deleted todo",
      resolve: (payload: Payload): TodoItem => payload.todo
    }
  },
  mutateAndGetPayload: async ({todoId, completed}, context, {rootValue}): Promise<Payload> => {
    const {id} = fromGlobalId(todoId)
    const todo = await TodoItem.gen(id, rootValue);
    if (!todo) {
      throw new Error(`Todo item with id ${id} does not exist`);
    }

    await todo.destroy(id, rootValue)
    return {
      todo,
    }
  }
})
