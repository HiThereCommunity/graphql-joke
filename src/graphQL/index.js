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
    GraphQLBoolean
} from 'graphql';

import {TodoItem, TodoList} from "./models";
var Pool = require('pg').Pool;


import {GraphQLTodoItem, GraphQLTodoList} from "./graphQLObjects";

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
                        type: GraphQLString
                    }
                },
                resolve: (db: Pool, {id}):Promise<?TodoItem> => TodoItem.gen(id, db)
            },
            createTodo: {
                type: GraphQLTodoItem,
                args: {
                    title: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (db: Pool, {title}): Promise<?TodoItem> => TodoItem.write(title, db)
            },
            getList: {
                type: GraphQLTodoList,
                resolve: (db: Pool, {}): Promise<TodoList> => TodoList.gen(db)

            }
        })
    }),
    mutation: new GraphQLObjectType({
        name: "Mutations",
        fields: () => ({
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
                resolve: (db: Pool, {id, completed}: {id: string, completed: boolean}): Promise<?TodoItem> => TodoItem.updateItem(id, completed, db)
            }
        })
    })
});