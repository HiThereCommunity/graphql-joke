// @flow

import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLInt, GraphQLID } from "graphql";
import { GraphQLJoke } from "../objects";
import { Joke } from "../../models";
import type { Context } from "../type";
import ClientError from './../../utils/clientError';

type Payload = { joke: Joke };

export default mutationWithClientMutationId({
  name: "UpdateJoke",
  description: "Update the funny level of a joke.",
  inputFields: {
    jokeId: { type: new GraphQLNonNull(GraphQLID) },
    funnyLevel: { type: new GraphQLNonNull(GraphQLInt) }
  },
  outputFields: {
    joke: {
      type: new GraphQLNonNull(GraphQLJoke),
      resolve: (payload: Payload): Joke => payload.joke
    }
  },
  mutateAndGetPayload: async (
    { jokeId, funnyLevel },
    { viewer, loaders }: Context
  ): Promise<Payload> =>
    {
      const { id } = fromGlobalId(jokeId);
      const joke = await Joke.gen(viewer, id, loaders.joke);
      if (!joke) {
        throw new ClientError(`Could not find a joke with id ${id}.`);
      }
      await joke.update(funnyLevel);
      return { joke };
    }
});
