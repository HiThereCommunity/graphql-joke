// @flow
import { GraphQLObjectType, GraphQLNonNull } from "graphql";
import { nodeField, nodesField, GraphQLUser } from "./objects";
import { User } from '../models'
import type { Context } from "./type";


export default new GraphQLObjectType({
  name: "Query",
  description: "The query root.",
  fields: () => ({
    node: nodeField,
    nodes: nodesField,
    viewer: {
      type: new GraphQLNonNull(GraphQLUser),
      description: "The currently authenticated user.",
      resolve: (root: Object, args: Object, context: Context): User => context.viewer
    }
  })
});
