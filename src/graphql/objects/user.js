// @flow

import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { nodeInterface } from "./relayNode";
import GraphQLTodoList from "./todoList";
import { User, TodoList } from "../../models";
import type { ID } from "../type";
import { globalIdField } from "graphql-relay";
import type { Context } from '../index'

export default new GraphQLObjectType({
  name: "User",
  description: "Represents the user that holds to dos",
  fields: () => ({
    id: globalIdField("User", (user: User): ID => user.getId()),
    todoList: {
      type: new GraphQLNonNull(GraphQLTodoList),
      description: "The list of todo items.",
      resolve: (root: Object, args: Object, context: Context): TodoList =>
        new TodoList(context.todoItemConnector)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The name of the user",
      resolve: (root: Object, args: Object, {viewer}: Context): string =>
        viewer.getName()
    }
  }),
  // Relay will use this function to determine if an object in your system is
  // of a particular GraphQL type
  isTypeOf: function(obj) {
    return obj instanceof User;
  },
  interfaces: [ nodeInterface ]
});
