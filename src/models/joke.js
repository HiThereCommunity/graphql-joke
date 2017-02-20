// @flow

import User from "./user";
import db from "../database";
import DataLoader from "dataloader";
import { isNumeric } from "../utils";
import type { ID } from "../graphql";

/**
 * A joke can only be seen by its creator.
 */
const canYouSeeJoke = (viewer: User, data: Object): boolean => {
  return viewer.id === String(data.creator);
};

export default class Joke {

  static async gen(
    viewer: User,
    id: string,
    loader: DataLoader<string, ?Object>
  ): Promise<?Joke> {
    if (!isNumeric(id)) return null;

    const data = await loader.load(id);
    if (!data) return null;
    const canSee = canYouSeeJoke(viewer, data);
    return canSee ? new Joke(data) : null;
  }

  static async write(
    viewer: User,
    text: string,
    funnyLevel: number,
    loader: DataLoader<string, ?Object>
  ): Promise<Joke> {
    if (text.length === 0) throw new Error('Joke cannot be an empty string.');
    if (funnyLevel < 0) throw new Error('Funny level must be an integer greater than or equal to zero');
    if (funnyLevel > 5) throw new Error(`Funny level ${funnyLevel} is too high, no joke is this funny`)


    const data = await db.joke.create({
      text,
      funnyLevel,
      creator: viewer.id
    });

    return new Joke(data);
  }

  _jokeEntity: Object;
  id: ID;
  text: string;
  funnyLevel: number;

  constructor(data: Object) {
    this.id = String(data.id);
    this.text = data.text;
    this.funnyLevel = data.funnyLevel;
    this._jokeEntity = data;
  }

  async update(funnyLevel: number): Promise<void> {

    if (funnyLevel < 0) throw new Error('Funny level must be an integer greater than or equal to zero');
    if (funnyLevel > 5) throw new Error(`Funny level ${funnyLevel} is too high, no joke is this funny`)

    if (this.funnyLevel === funnyLevel) return;

    this._jokeEntity.funnyLevel = funnyLevel;
    this._jokeEntity.save();
    this.funnyLevel = funnyLevel;
  }

  async destroy(loader: DataLoader<string, ?Object>): Promise<void> {
    await this._jokeEntity.destroy();
    loader.clear(this.id);
  }
}
