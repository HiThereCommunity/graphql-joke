// @flow

/**
 * Created by dirk-janrutten on 13/08/16.
 */

import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLID,
    GraphQLNonNull
} from 'graphql';

import {TodoItem} from "./../models";

export default new GraphQLObjectType({
    name: "TodoItem",
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: (todoItem: TodoItem): string => todoItem.getId()
        },
        title: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (todoItem: TodoItem): string => todoItem.getTitle()
        },
        isDone: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: (todoItem: TodoItem): boolean => todoItem.getIsDone()
        }
    })
});