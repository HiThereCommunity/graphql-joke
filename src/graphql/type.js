// @flow
import {TodoItemConnector, UserConnector} from '../connectors';
import {User} from '../models'

export type ID = string;

export type {TodoItemConnector, UserConnector} from '../connectors';

export type Context = {
  todoItemConnector: TodoItemConnector,
  viewer: User
}
