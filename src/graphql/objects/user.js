// @flow

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean
} from "graphql";
import {
  globalIdField,
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray,
} from "graphql-relay";

import { nodeInterface } from "./relayNode";
import GraphQLTodoItem from "./todoItem";

import { User, TodoItem } from "../../models";
import type { ID, Context } from "../type";

import ClientError from "./../../utils/clientError";

const { connectionType: TodoItemConnection } = connectionDefinitions({
  nodeType: GraphQLTodoItem
});

export default new GraphQLObjectType({
  name: "User",
  description: "Represents a happy owner of some todos",
  fields: () => ({
    id: globalIdField("TodoItem", (user: User): ID => user.id),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The name of the user",
      resolve: (root: Object, args: Object, { viewer }: Context): string => {
        throw new ClientError("aaaao");
      }
    },
    todos: {
      type: TodoItemConnection,
      description: "All the todo items.",
      args: {
        completed: {
          type: GraphQLBoolean,
          description: "An optional filter for completed todo items, if not set then all todos are retrieved"
        },
        ...connectionArgs
      },
      resolve: (user: User, args, { viewer, loaders }: Context) =>
        connectionFromPromisedArray(
          TodoItem.genList(viewer, loaders.todoItem, user, args.completed),
          args
        )
    }
  }),
  // Relay will use this function to determine if an object in your system is
  // of a particular GraphQL type
  isTypeOf: function(obj) {
    return obj instanceof User;
  },
  interfaces: [nodeInterface]
});
