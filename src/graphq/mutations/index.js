// @flow

import {GraphQLObjectType} from 'graphql';

import {TodoItem} from "../../models";
import {GraphQLTodoItem} from "../objects";
import type {GraphQLIDInput} from '../type';
import type {RootValue} from "../../types";
import GraphQLMutationCreateTodo from './addTodo';
import GraphQLMutationUpdateTodo from './updateTodo';
import GraphQLMutationDeleteTodo from './deleteTodo';

export default new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
        addTodo: GraphQLMutationCreateTodo,
        updateTodo: GraphQLMutationUpdateTodo,
        deleteTodo: GraphQLMutationDeleteTodo
    })
});
