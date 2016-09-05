// @flow
/**
 * Copyright (c) 2016, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLInt
} from 'graphql';

import {TodoItem, TodoList} from "./models";
import {GraphQLTodoItem, GraphQLTodoList} from "./graphQLObjects";

import type {RootValue} from "./types";


export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Queries',
        description: "All the queries that can be used to retrieve data",
        fields: () => ({
            getTodo: {
                type: GraphQLTodoItem,
                description: "todo item",
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (root: RootValue, {id}):Promise<?TodoItem> => TodoItem.gen(id, root)
            },
            getList: {
                type: GraphQLTodoList,
                resolve: (root: RootValue, {}): Promise<TodoList> => TodoList.gen(root)

            }
        })
    }),
    mutation: new GraphQLObjectType({
        name: "Mutations",
        fields: () => ({
            createTodo: {
                type: GraphQLTodoItem,
                args: {
                    title: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (root: RootValue, {title}):Promise<?TodoItem> => TodoItem.write(title, root)
            },
            updateTodo: {
                type: GraphQLTodoItem,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    completed: {
                        type: new GraphQLNonNull(GraphQLBoolean)
                    }
                },
                resolve: (root: RootValue, {id, completed}: {id: number, completed: boolean}):Promise<?TodoItem> => TodoItem.update(id, completed, root)
            },
            removeTodo: {
                type: GraphQLTodoItem,
                description: "Remove a to do item from the to do list.",
                args: {
                    id: {
                        type: GraphQLString
                    }
                },
                resolve: (root: RootValue, {id}: {id: number}):Promise<number> => TodoItem.delete(id, root)
            }
        })
    })
});