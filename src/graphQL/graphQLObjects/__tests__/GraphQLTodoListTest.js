/**
 * Created by dirk-janrutten on 14/08/16.
 */


/**
 * Created by dirk-janrutten on 14/08/16.
 */


import {TodoItem, TodoList} from "./../../models";
import { expect } from 'chai';

import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType
} from "graphql";

import { GraphQLTodoList} from "../";

describe("Test for the GraphQLTodoItem", ()=> {

    let todoItem1: TodoItem = TodoItem.initializeFromData("3", "go golfing", true);
    let todoItem2: TodoItem = TodoItem.initializeFromData("4", "play tennis", false);
    let todoList: TodoList = new TodoList([todoItem1, todoItem2]);

    let schema: GraphQLSchema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Queries',
            fields: () => ({
                getList: {
                    type: GraphQLTodoList,
                    resolve: ():TodoList => todoList
                }
            })
        })
    });

    it("Correctly parses a GraphQLTodoList from a model", async () => {

        let todoResult = await graphql(schema, `{ getList{all {id} completed{id} active{id} } }`);

        expect(todoResult).to.deep.equal({
            data: {
                getList: {
                    all: [
                        {id: "3"},
                        {id: "4"}
                    ],
                    completed: [
                        {id: "3"}
                    ],
                    active: [
                        {id: "4"}
                    ]
                }
            }
        })
    });
});




