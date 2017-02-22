// @flow

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString
} from "graphql";
import {
  globalIdField,
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray,
  fromGlobalId
} from "graphql-relay";

import { nodeInterface } from "./relayNode";
import GraphQLJoke from "./joke";

import { User, Joke } from "../../models";
import type { ID, Context } from "../type";


const { connectionType: JokeItemConnection } = connectionDefinitions({
  nodeType: GraphQLJoke
});

export default new GraphQLObjectType({
  name: "User",
  description: "Represents a user of the joke API.",
  fields: () => ({
    id: globalIdField("User", (user: User): ID => user.id),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The name of the user",
      resolve: (user: User, args: Object): string => user.name
    },
    jokes: {
      type: new GraphQLNonNull(JokeItemConnection),
      description: "All the user's jokes.",
      args: connectionArgs,
      resolve: (user: User, args, { viewer, loaders }: Context) =>
        connectionFromPromisedArray(
          user.jokes(loaders.joke),
          args
        )
    },
    joke: {
      type: GraphQLJoke,
      description: "The user's joke for an id",
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: "The id of the joke"
        }
      },
      resolve: async (user: User, args, { viewer, loaders }: Context) => {
        const { id }: { id: string } = fromGlobalId(args.id);
        return await Joke.gen(viewer, id, loaders.joke);
      }
    }
  }),
  // Relay will use this function to determine if an object in your system is
  // of a particular GraphQL type
  isTypeOf: function(obj) {
    return obj instanceof User;
  },
  interfaces: [nodeInterface]
});
