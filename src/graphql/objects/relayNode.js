// @flow

import { nodeDefinitions, fromGlobalId } from "graphql-relay";
import { TodoItem, TodoList } from "../../models";
import type {Context} from "../../graphql";

/**
 * We get the node interface and field from the relay library.
 *
 * The first method is the way we resolve an ID to its object. The second is the
 * way we resolve an object that implements node to its type.
 */
export const { nodeInterface, nodeField, nodesField } = nodeDefinitions(async (
  globalId,
  context
) =>
  {
    const { type, id } = fromGlobalId(globalId);

    if (type === "TodoItem") {
      return await TodoItem.gen(id, context.todoItemConnector);
    }
    if (type === "TodoList") {
      return await TodoList.gen(id, context.todoItemConnector);
    }
    return null;
  });
