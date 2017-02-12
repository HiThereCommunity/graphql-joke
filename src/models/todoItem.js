// @flow

import User from "./user";
import db from "../database";
import DataLoader from "dataloader";
import { isNumeric } from "../utils";

const checkCanSee = (viewer: User, data: Object): boolean => {
  return viewer.id === String(data.creator);
};

export default class TodoItem {
  static initializeFromData(
    id: number,
    title: string,
    completed: boolean
  ): TodoItem {
    return new TodoItem({
      id,
      title,
      completed
    });
  }

  static async gen(
    viewer: User,
    id: string,
    loader: DataLoader<string, ?Object>
  ): Promise<?TodoItem> {
    if (!isNumeric(id)) return null;

    //With batching/caching
    const data = await loader.load(id);

    //without batching/caching
    //const data = await db.todo_item.findById(id);
    if (!data) return null;
    const canSee = checkCanSee(viewer, data);
    return canSee ? new TodoItem(data) : null;
  }

  static async write(
    viewer: User,
    title: string,
    loader: DataLoader<string, ?Object>
  ): Promise<TodoItem> {
    const data = await db.todo_item.create({
      title,
      completed: false,
      creator: viewer.id
    });

    //Update the cache
    loader.prime(data.id, data);
    return new TodoItem(data);
  }

  static async genList(
    viewer: User,
    loader: DataLoader<string, ?Object>,
    user: User,
    completed: ?boolean
  ): Promise<Array<TodoItem>> {

    const data = await db.todo_item.findAll({
      where: {
        creator: user.id,
        ...(completed ? { completed } : null)
      },
      attributes: ["id"]
    });

    return data.map(entry => TodoItem.gen(viewer, entry.id, loader));
  }

  _todoEntity: Object;
  id: string;
  title: string;
  completed: boolean;

  constructor(data: Object) {
    this.id = String(data.id);
    this.title = data.title;
    this.completed = data.completed;
    this._todoEntity = data;
  }

  async update(completed: boolean): Promise<void> {
    if (this.completed === completed) return;

    this._todoEntity.completed = completed;
    this._todoEntity.save();
    this.completed = completed;
  }

  async destroy(loader: DataLoader<string, ?Object>): Promise<void> {
    await this._todoEntity.destroy();
    loader.clear(this.id);
  }
}
