// @flow

import TodoItem from './todoItem'
import type {TodoItemConnector} from '../graphql'

const todoListId = 'TodoListId'

export default class TodoList {

  _root: TodoItemConnector;

  static gen (id: string, root: TodoItemConnector): ?TodoList {
    return id === todoListId ? new TodoList(root) : null
  }

  constructor (root: TodoItemConnector) {
    this._root = root
  }

  getId (): string {
    return todoListId
  }

  async getAll (): Promise<Array<TodoItem>> {

    const allTodos = await this._root.getEntity().findAll()
    return allTodos.map(todoDB => new TodoItem(todoDB))
  }

  async getCompleted (): Promise<Array<TodoItem>> {

    const completedTodos = await this._root.getEntity().findAll({
      where: {
        completed: true
      }
    })
    return completedTodos.map(todoDB => new TodoItem(todoDB))
  }

  async getActive (): Promise<Array<TodoItem>> {
    const activeTodos = await this._root.getEntity().findAll({
      where: {
        completed: false
      }
    })
    return activeTodos.map(todoDB => new TodoItem(todoDB))
  }
}
