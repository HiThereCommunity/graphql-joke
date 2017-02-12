// @flow

import db from "../database";

function normalizeDbResults(keys, indexField, cacheKeyFn = key => key) {
  return results => {
    var indexedResults = indexResults(results, indexField, cacheKeyFn);
    return keys.map(
      val =>
        indexedResults.get(cacheKeyFn(val)) || null
    );
  };
}

function indexResults(results, indexField, cacheKeyFn = key => key) {
  var indexedResults = new Map();
  results.forEach(res => {
    indexedResults.set(cacheKeyFn(res[indexField]), res);
  });
  return indexedResults;
}

export const batchGetTodoItems = (ids: Array<string>) => db.todo_item
  .findAll({
    where: {
      id: { $in: ids }
    }
  })
  .then(normalizeDbResults(ids, "id", key => String(key)));

export const batchGetUsers = (ids: Array<string>) => db.user
  .findAll({
    where: {
      id: { $in: ids }
    }
  })
  .then(normalizeDbResults(ids, "id", key => String(key)));
