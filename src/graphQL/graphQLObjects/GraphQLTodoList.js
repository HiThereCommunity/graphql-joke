// @flow

/**
 * Created by dirk-janrutten on 13/08/16.
 */

import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLID,
    GraphQLNonNull,
    GraphQLList
} from 'graphql';

import GraphQLTodoItem from "./GraphQLTodoItem";
import {TodoList, TodoItem} from "./../models";

export default new GraphQLObjectType({
    name: "TodoList",
    fields: () => ({
        all: {
            type: new GraphQLList(GraphQLTodoItem),
            resolve: (todoList: TodoList): Array<TodoItem> => todoList.getAll()
        },
        completed: {
            type: new GraphQLList(GraphQLTodoItem),
            resolve: (todoList: TodoList): Array<TodoItem> => todoList.getCompleted()
        },
        active: {
            type: new GraphQLList(GraphQLTodoItem),
            resolve: (todoList: TodoList): Array<TodoItem> => todoList.getActive()
        }
    })
});