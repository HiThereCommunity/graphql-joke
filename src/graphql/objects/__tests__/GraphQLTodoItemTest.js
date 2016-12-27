/**
 * Created by dirk-janrutten on 14/08/16.
 */


import {TodoItem} from "./../../models";
import { expect } from 'chai';

import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType
} from "graphql";

import { GraphQLTodoItem} from "../";

describe("Test for the GraphQLTodoItem", ()=> {


    let todoItem: TodoItem = TodoItem.initializeFromData("3", "go golfing", true);

    let schema: GraphQLSchema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Queries',
            fields: () => ({
                getTodo: {
                    type: GraphQLTodoItem,
                    resolve: ():TodoItem => todoItem
                }
            })
        })
    });

    it("Correctly parses a GraphQLTodoItem from a model", async () => {

        let todoResult = await graphql(schema, `{ getTodo{id title isDone} }`);

        expect(todoResult).to.deep.equal({
            data: {
                getTodo: {
                    id: "3",
                    title: "go golfing",
                    isDone: true
                }
            }
        })
    });




});




