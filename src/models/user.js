// @flow
/**
 * Created by Florentijn Hogerwerf on 11/02/17.
 */


import {TodoItemConnector} from '../connectors';
import type {UserConnector} from '../graphql'

export default class User {

  static async gen (id: string, userConnector: UserConnector): Promise<?User> {
    const user = await userConnector.getEntity().findOne({id});
    return user ? new User(user) : null
  }

  _userEntity: Object;

  constructor (data: Object) {
    this._userEntity = data
  }

  getId (): string {
    return String(this._userEntity.id)
  }

  getName(): string {
    return this._userEntity.name
  }
}
