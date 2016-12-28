// @flow
/**
 * Created by Dirk-Jan Rutten on 13/08/16.
 */

import type {TodoItemEntity} from './../connectors'
import type {RootValue} from './../types'

export default class TodoItem {

  static initializeFromData (id: number, title: string, completed: boolean): TodoItem {
    return new TodoItem({
      id,
      title,
      completed
    })
  }

  static async gen (id: string, {db}: RootValue): Promise<?TodoItem> {
    const todoItem = await db.getTodoItemEntity().findById(id)
    return todoItem ? new TodoItem(todoItem) : null
  }

  static async write (title: string, {db}: RootValue): Promise<?TodoItem> {
    const newTodoItem = await db.getTodoItemEntity().create({
      title,
      completed: false
    })
    return newTodoItem ? new TodoItem(newTodoItem) : null
  }

  static async update (id: string, completed: boolean, {db}: RootValue): Promise<?TodoItem> {
    const todoItem = await db.getTodoItemEntity().findById(id)
    if (!todoItem) return null

    await todoItem.updateAttributes({completed})

    return new TodoItem(todoItem)
  }

  static async delete (id: string, {db}: RootValue): Promise<?TodoItem> {
    const todoItem = await db.getTodoItemEntity().findById(id)
    if (!todoItem) return null

    const deletedTodoItem = new TodoItem(todoItem)

    await todoItem.destroy()

    return deletedTodoItem
  }

  _data: TodoItemEntity;

  constructor (data: TodoItemEntity) {
    this._data = data
  }

  getId (): number {
    return this._data.id
  }
  getTitle (): string {
    return this._data.title
  }
  getCompleted (): boolean {
    return this._data.completed
  }
}
