// @flow

import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLID,
    GraphQLNonNull,
    GraphQLList
} from 'graphql';

import {
  globalIdField,
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray
} from 'graphql-relay';

import {
  nodeInterface
} from '../relay';

import GraphQLTodoItem from "./todoItem";
import {TodoList, TodoItem} from "../../models";
import type {GraphQLIDOutput} from '../type';

let {connectionType: TodoItemConnection} =
  connectionDefinitions({nodeType: GraphQLTodoItem});

export default new GraphQLObjectType({
  name: "TodoList",
  fields: () => ({
      id: globalIdField(
        'TodoList',
        (todoList: TodoList): GraphQLIDOutput => todoList.getId()
      ),
      items: {
        type: TodoItemConnection,
        args: connectionArgs,
        resolve: (todoList: TodoList, args) => connectionFromPromisedArray(todoList.getAll(), args)
      },
      completed: {
        type: TodoItemConnection,
        args: connectionArgs,
        resolve: (todoList: TodoList, args) => connectionFromPromisedArray(todoList.getCompleted(), args)
      },
      active: {
        type: TodoItemConnection,
        args: connectionArgs,
        resolve: (todoList: TodoList, args) => connectionFromPromisedArray(todoList.getActive(), args)
      }
  }),
  // Relay will use this function to determine if an object in your system is
  // of a particular GraphQL type
  isTypeOf: function(obj) { return obj instanceof TodoList },
  interfaces: [ nodeInterface ]
});
