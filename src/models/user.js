// @flow

import DataLoader from "dataloader";
import { isNumeric } from "../utils";
import Joke from "./joke";
import db from "../database";

const checkCanSee = (viewer: User, data: Object): boolean => {
  return viewer.id === String(data.id);
};

export default class User {
  static async gen(
    viewer: User,
    id: string,
    loader: DataLoader<string, ?Object>
  ): Promise<?User> {
    if (!isNumeric(id)) return null;
    const data = await loader.load(id);
    if (!data) return null;
    const canSee = checkCanSee(viewer, data);
    return canSee ? new User(data) : null;
  }

  static async genAuth(
    id: string,
    loader: DataLoader<string, ?Object>
  ): Promise<?User> {
    if (!isNumeric(id)) return null;

    let user;
    user = await loader.load(id);

    // If user doesn't exist then create one to mock
    // the behavior of retrieving a user from an auth token.
    if (!user) {
      user = await db.user.create({
        id,
        name: "Bob"
      });
    }
    return new User(user);
  }

  id: string;
  name: string;
  _viewer: User;

  constructor(data: Object, viewer: ?User) {
    this.id = String(data.id);
    this.name = data.name;
    if (viewer) this._viewer = viewer;
    else this._viewer = this;
  }

  async jokes(
    jokeLoader: DataLoader<string, ?Object>
  ): Promise<Array<Promise<?Joke>>> {
    const data: Array<{ id: number }> = await db.joke.findAll({
      where: {
        creator: this.id
      },
      attributes: ["id"]
    });

    const map = data.map(entry =>
      Joke.gen(this._viewer, String(entry.id), jokeLoader));
    return map;
  }
}
