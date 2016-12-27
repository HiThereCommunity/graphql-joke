// @flow

import {
  mutationWithClientMutationId
} from 'graphql-relay';

import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLInt
} from 'graphql';

import {GraphQLTodoItem} from '../objects';
import {TodoItem} from '../../models';

export default mutationWithClientMutationId({
  name: "AddTodoItem",
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
    const newTodo = await TodoItem.write(title, rootValue);
    return {
      todo: newTodo
    }
  }
});
