// @flow

import {
  nodeDefinitions,
  fromGlobalId
} from 'graphql-relay';

import {
  TodoItem,
  TodoList
} from '../models';

/**
 * We get the node interface and field from the relay library.
 *
 * The first method is the way we resolve an ID to its object. The second is the
 * way we resolve an object that implements node to its type.
 */
export const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, context, {rootValue}) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === 'TodoItem') {
      return TodoItem.gen(id, rootValue);
    }
    if (type === 'TodoList') {
      return TodoList.gen(id, rootValue);
    }
    return null;
  }
);
