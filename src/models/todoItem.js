// @flow
/**
 * Created by Dirk-Jan Rutten on 13/08/16.
 */

import type {TodoItemEntity} from './../connectors'
import type {RootValue} from './../types'

import { PostgresConnector } from '../connectors';
import DataLoader from 'dataloader';

export default class TodoItem {

  static initializeFromData (id: number, title: string, completed: boolean): TodoItem {
    return new TodoItem({
      id,
      title,
      completed
    })
  }

  static async gen (id: string, loader: DataLoader<string, Object>): Promise<?TodoItem> {
    const todoItem = await loader.load(id);
    return todoItem ? new TodoItem(todoItem) : null
  }

  static async write (title: string, db: PostgresConnector): Promise<TodoItem> {
    const newTodoItem = await db.getTodoItemEntity().create({
      title,
      completed: false
    })
    return new TodoItem(newTodoItem)
  }

  _todoEntity: Object;

  constructor (data: Object) {
    this._todoEntity = data
  }

  getId (): string {
    return String(this._todoEntity.id)
  }
  getTitle (): string {
    return this._todoEntity.title
  }
  getCompleted (): boolean {
    return this._todoEntity.completed
  }

  async update(completed: boolean): Promise<void> {
    this._todoEntity.completed = completed;
    this._todoEntity.save();
  }

  async destroy(): Promise<void> {
    await this._todoEntity.destroy()
  }
}
