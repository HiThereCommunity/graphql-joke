// @flow

import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLID } from "graphql";
import { GraphQLJoke } from "../objects";
import { Joke } from "../../models";
import type { Context } from "../type";

type Payload = { joke: Joke };

export default mutationWithClientMutationId({
  name: "DeleteJoke",
  description: "Delete a joke.",
  inputFields: { jokeId: { type: new GraphQLNonNull(GraphQLID) } },
  outputFields: {
    joke: {
      type: new GraphQLNonNull(GraphQLJoke),
      description: "The deleted joke",
      resolve: (payload: Payload): Joke => payload.joke
    }
  },
  mutateAndGetPayload: async (
    { jokeId },
    { viewer, loaders }: Context
  ): Promise<Payload> => {
    const { id }: { id: string } = fromGlobalId(jokeId);

    const joke = await Joke.gen(viewer, id, loaders.joke);
    if (!joke) throw new Error(`Joke with id ${id} does not exist`);

    await joke.destroy(loaders.joke);
    return { joke };
  }
});
