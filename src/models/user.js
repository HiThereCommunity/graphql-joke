// @flow

import DataLoader from 'dataloader';
import { isNumeric } from '../utils';

const checkCanSee = (viewer: User, data: Object): boolean => {
  return viewer.id === String(data.id);
}

export default class User {

  static async gen(viewer: User, id: string, loader: DataLoader<string, ?Object>): Promise<?User> {
    if (!isNumeric(id)) return null;
    const data = await loader.load(id);
    if (!data) return null;
    const canSee = checkCanSee(viewer, data);
    return canSee ? new User(data) : null;
  }

  //TODO: Add authorization token here...
  static async genAuth (id: string, loader: DataLoader<string, ?Object>): Promise<?User> {
    if (!isNumeric(id)) return null;
    const user = await loader.load(id);
    return user ? new User(user) : null
  }

  id: string;
  name: string;

  constructor (data: Object) {
    this.id = String(data.id);
    this.name = data.name;
  }
}
