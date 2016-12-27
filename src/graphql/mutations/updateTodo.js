// @flow

import {
  mutationWithClientMutationId,
  fromGlobalId
} from 'graphql-relay';

import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLID
} from 'graphql';

import {GraphQLTodoItem} from '../objects';
import {TodoItem} from '../../models';

export default mutationWithClientMutationId({
  name: "UpdateTodoItem",
  inputFields: {
    todoId: {
      type: new GraphQLNonNull(GraphQLID)
    },
    completed: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  },
  outputFields: {
    updatedTodo: {
      type: new GraphQLNonNull(GraphQLTodoItem),
      resolve: (payload) => payload.todo
    }
  },
  mutateAndGetPayload: async ({todoId, completed}, context, {rootValue}) => {
    const {id} = fromGlobalId(todoId);
    const updatedTodo = await TodoItem.update(id, completed, rootValue);
    return {
      todo: updatedTodo
    }
  }
});
