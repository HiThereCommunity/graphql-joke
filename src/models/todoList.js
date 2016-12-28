// @flow

import TodoItem from './todoItem'
import type {RootValue} from '../types'

const todoListId = 'TodoListId'

export default class TodoList {

  _root: RootValue;

  static gen (id: string, root: RootValue): ?TodoList {
    return id === todoListId ? new TodoList(root) : null
  }

  constructor (root: RootValue) {
    this._root = root
  }

  getId (): string {
    return todoListId
  }

  async getAll (): Promise<Array<TodoItem>> {
    const allTodos = await this._root.db.getTodoItemEntity().findAll()
    return allTodos.map(todoDB => new TodoItem(todoDB))
  }

  async getCompleted (): Promise<Array<TodoItem>> {
    const completedTodos = await this._root.db.getTodoItemEntity().findAll({
      where: {
        completed: true
      }
    })
    return completedTodos.map(todoDB => new TodoItem(todoDB))
  }

  async getActive (): Promise<Array<TodoItem>> {
    const activeTodos = await this._root.db.getTodoItemEntity().findAll({
      where: {
        completed: false
      }
    })
    return activeTodos.map(todoDB => new TodoItem(todoDB))
  }

}
