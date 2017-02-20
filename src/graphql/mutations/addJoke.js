// @flow

import { mutationWithClientMutationId } from "graphql-relay";
import { GraphQLString, GraphQLNonNull } from "graphql";
import { GraphQLJoke } from "../objects";
import { Joke } from "../../models";
import type { Context } from "../type";

export default mutationWithClientMutationId({
  name: "AddJoke",
  description: "Add a new joke.",
  inputFields: {
    text: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The joke."
    },
    funnyLevel: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The funny level of the joke, the higher the better."
    }
  },
  outputFields: {
    newTodo: {
      type: new GraphQLNonNull(GraphQLJoke),
      resolve: payload => payload.joke
    }
  },
  mutateAndGetPayload: async ({ text, funnyLevel }, { viewer, loaders }: Context) => {
    const newJoke = await Joke.write(viewer, text, funnyLevel, loaders.joke);
    return { joke: newJoke };
  }
});
