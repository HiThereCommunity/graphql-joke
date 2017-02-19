// @flow

import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull } from "graphql";
import { GraphQLTodoItem } from "../objects";
import { TodoItem } from "../../models";
import type { Context } from "../type";

export default mutationWithClientMutationId({
  name: "AddTodo",
  description: "Add a new todo item.",
  inputFields: { title: { type: new GraphQLNonNull(GraphQLString) } },
  outputFields: {
    newTodo: {
      type: new GraphQLNonNull(GraphQLTodoItem),
      resolve: payload => payload.todo
    }
  },
  mutateAndGetPayload: async ({ title }, {viewer, loaders}: Context) => {
    const newTodo = await TodoItem.write(viewer, title, loaders.todoItem);
    return { todo: newTodo };
  }
});
