// @flow
/**
 * Created by Dirk-Jan Rutten on 13/08/16.
 */

import {TodoItemConnector} from '../connectors';
import User from './User'
export default class TodoItem {

  static initializeFromData (id: number, title: string, completed: boolean): TodoItem {
    return new TodoItem({
      id,
      title,
      completed
    })
  }

  static async gen (id: string, todoConnector: TodoItemConnector): Promise<?TodoItem> {
    
    const todoItem = await todoConnector.fetch(id);
    return todoItem ? new TodoItem(todoItem) : null
  }

  static async write (title: string, todoConnector: TodoItemConnector, user: User): Promise<TodoItem> {

    const newTodoItem = await todoConnector.getEntity().create({
      title,
      completed: false,
      user_account: user.getId()
    });
    return new TodoItem(newTodoItem);
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
